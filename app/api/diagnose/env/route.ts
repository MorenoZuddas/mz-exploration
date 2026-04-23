import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  // Questo endpoint mostra le variabili di ambiente configurate (SENZA i valori sensibili)
  const env = {
    MONGODB_URI: process.env.MONGODB_URI ? '***SET***' : 'NOT_SET',
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'NOT_SET',
    MONGODB_AUTO_MAINTENANCE: process.env.MONGODB_AUTO_MAINTENANCE || 'NOT_SET',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'NOT_SET',
    NODE_ENV: process.env.NODE_ENV || 'NOT_SET',
  };

  return NextResponse.json({
    status: 'Environment variables check',
    environment: env,
    timestamp: new Date().toISOString(),
  });
}

