import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000';

export default function () {
  const headers = { 'Content-Type': 'application/json' };

  // Register device
  const deviceRes = http.post(`${BASE_URL}/monitoring/devices`, JSON.stringify({
    patient_id: 1,
    device_type: 'bp_cuff',
    serial_number: `SN-${__VU}-${__ITER}`,
  }), { headers });

  check(deviceRes, { 'device registered': (r) => r.status === 201 });

  // Record reading
  const readingRes = http.post(`${BASE_URL}/monitoring/readings`, JSON.stringify({
    patient_id: 1,
    vital_type: 'heart_rate',
    value: 70 + Math.random() * 30,
    unit: 'bpm',
  }), { headers });

  check(readingRes, { 'reading recorded': (r) => r.status === 201 });

  // Check alerts
  http.get(`${BASE_URL}/monitoring/alerts?patient_id=1`, { headers });

  sleep(0.5);
}
EOF