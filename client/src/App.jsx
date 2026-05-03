import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

const PATIENTS = {
  P001: 'Maria Lopez',
  P002: 'James Chen',
  P003: 'Aisha Patel',
  P004: 'Carlos Ruiz',
  P005: 'Emma Fischer',
};

function getStatus(vitals) {
  if (
    vitals.heartRate > 130 ||
    vitals.spo2 < 92 ||
    vitals.bloodPressure.systolic > 160
  ) return 'critical';
  if (
    vitals.heartRate > 110 ||
    vitals.spo2 < 95 ||
    vitals.bloodPressure.systolic > 140
  ) return 'warning';
  return 'normal';
}

const STATUS_STYLES = {
  normal:   'bg-green-100 text-green-800',
  warning:  'bg-yellow-100 text-yellow-800',
  critical: 'bg-red-100 text-red-800 animate-pulse',
};

function PatientCard({ vitals }) {
  const status = getStatus(vitals);
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            {vitals.patientId}
          </p>
          <p className="text-base font-medium text-gray-900">
            {PATIENTS[vitals.patientId]}
          </p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_STYLES[status]}`}>
          {status}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1">Heart Rate</p>
          <p className="text-xl font-medium text-gray-900">{vitals.heartRate}</p>
          <p className="text-xs text-gray-400">bpm</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1">SpO2</p>
          <p className="text-xl font-medium text-gray-900">{vitals.spo2}</p>
          <p className="text-xs text-gray-400">%</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1">BP</p>
          <p className="text-xl font-medium text-gray-900">
            {vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic}
          </p>
          <p className="text-xs text-gray-400">mmHg</p>
        </div>
      </div>
      <p className="text-xs text-gray-300 text-right">
        {new Date(vitals.timestamp).toLocaleTimeString()}
      </p>
    </div>
  );
}

export default function App() {
  const [vitalsMap, setVitalsMap] = useState({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('vitals', (data) => {
      setVitalsMap((prev) => ({ ...prev, [data.patientId]: data }));
    });
    return () => socket.off();
  }, []);

  const patients = Object.values(vitalsMap);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-medium">VitalSync</h1>
            <p className="text-sm text-gray-400">ICU Real-Time Monitor</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-sm text-gray-400">
              {connected ? 'Live' : 'Disconnected'}
            </span>
          </div>
        </div>

        {patients.length === 0 ? (
          <p className="text-gray-500 text-center mt-20">
            Waiting for vitals...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map((v) => (
              <PatientCard key={v.patientId} vitals={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}