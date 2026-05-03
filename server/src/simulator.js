const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const PATIENTS = [
  { id: 'P001', name: 'Maria Lopez' },
  { id: 'P002', name: 'James Chen' },
  { id: 'P003', name: 'Aisha Patel' },
  { id: 'P004', name: 'Carlos Ruiz' },
  { id: 'P005', name: 'Emma Fischer' },
];

function randomInRange(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function generateVitals(patientId) {
  const anomaly = Math.random() < 0.05;

  return {
    patientId,
    timestamp: new Date().toISOString(),
    heartRate: anomaly ? randomInRange(140, 180) : randomInRange(60, 100),
    spo2: anomaly ? randomInRange(85, 91) : randomInRange(95, 100),
    bloodPressure: {
      systolic: anomaly ? randomInRange(160, 190) : randomInRange(90, 140),
      diastolic: randomInRange(60, 90),
    },
  };
}

function startSimulator() {
  console.log('🏥 Vitals simulator started');

  setInterval(() => {
    PATIENTS.forEach((patient) => {
      const vitals = generateVitals(patient.id);
      redis.publish(`vitals:${patient.id}`, JSON.stringify(vitals));
      console.log(`📡 Published vitals for ${patient.name}:`, vitals);
    });
  }, 2000);
}

startSimulator();