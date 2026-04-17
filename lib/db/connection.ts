import mongoose, { Connection } from 'mongoose';

let cachedConnection: Connection | null = null;
let maintenanceReady = false;
let maintenanceRunPromise: Promise<void> | null = null;

async function ensureDatabaseMaintenance(): Promise<void> {
  if (maintenanceReady) return;

  if (!maintenanceRunPromise) {
    maintenanceRunPromise = (async () => {
      // Policy: manutenzione SOLO opt-in.
      if (process.env.MONGODB_AUTO_MAINTENANCE !== 'true') {
        maintenanceReady = true;
        console.log('ℹ️ Auto maintenance MongoDB disabilitata (opt-in)');
        return;
      }

      try {
        const { runDatabaseMaintenanceOnce } = await import('./maintenance');
        await runDatabaseMaintenanceOnce();
      } catch (error) {
        // Non blocca l'app: il DB resta operativo anche se la manutenzione fallisce.
        console.error('⚠️ Errore durante auto maintenance MongoDB:', error);
      } finally {
        maintenanceReady = true;
      }
    })();
  }

  await maintenanceRunPromise;
}

function isConnectionAlive(conn: Connection | null): boolean {
  if (!conn) return false;
  // 1 = connected (mongoose.ConnectionStates.connected)
  return conn.readyState === 1 && mongoose.connection.readyState === 1;
}

export async function connectToDatabase(): Promise<Connection> {
  if (isConnectionAlive(cachedConnection)) {
    console.log('📦 Usando connessione MongoDB in cache');
    await ensureDatabaseMaintenance();
    return cachedConnection as Connection;
  }

  // Se la cache esiste ma non e' viva, la scartiamo per evitare operazioni bufferizzate.
  if (cachedConnection && !isConnectionAlive(cachedConnection)) {
    cachedConnection = null;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('❌ MONGODB_URI non è definito in .env.local');
  }

  console.log('🔗 Creando nuova connessione a MongoDB...');

  try {
    // Se mongoose e' rimasto in stato non connesso da un tentativo precedente, chiudi prima di riconnettere.
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    const conn = await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB_NAME || 'mz-exploration',
      maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '10'),
      minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '1'),
      serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || '10000'),
      socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT_MS || '45000'),
    });

    cachedConnection = conn.connection;
    console.log('✅ Connessione MongoDB stabilita');
    await ensureDatabaseMaintenance();
    return cachedConnection;
  } catch (error) {
    cachedConnection = null;
    console.error('❌ Errore connessione MongoDB:', error);
    throw error;
  }
}

export async function disconnectFromDatabase(): Promise<void> {
  if (cachedConnection) {
    await mongoose.disconnect();
    cachedConnection = null;
    maintenanceReady = false;
    maintenanceRunPromise = null;
    console.log('🔌 Disconnesso da MongoDB');
  }
}
