const mongoose = require('mongoose');

async function checkActivities() {
  try {
    console.log('🔗 Connessione a MongoDB...');
    await mongoose.connect('mongodb://127.0.0.1:27017/mz-exploration', {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ Connesso!');

    // Conta le attività
    const db = mongoose.connection.db;
    const count = await db.collection('activities').countDocuments();
    console.log(`\n📊 ATTIVITÀ NEL DATABASE: ${count}\n`);

    // Mostra le ultime 5
    const activities = await db
      .collection('activities')
      .find()
      .sort({ date: -1 })
      .limit(5)
      .toArray();

    console.log('📋 Ultime attività:');
    activities.forEach((act, i) => {
      console.log(`${i + 1}. ${act.name} (${act.type}) - ${act.distance}m - ${new Date(act.date).toLocaleDateString('it-IT')}`);
    });

    console.log('\n✅ Check completato');
    process.exit(0);
  } catch (error) {
    console.error('❌ Errore:', error.message);
    process.exit(1);
  }
}

checkActivities();

