import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const latencyTrend = new Trend('latency');

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    errors: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000';

export default function () {
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: 'patient@example.com',
    password: 'password123',
  }), { headers: { 'Content-Type': 'application/json' } });

  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
  });

  const token = loginRes.json('access_token');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  // Schedule a visit
  const visitPayload = JSON.stringify({
    patient_id: 1,
    doctor_id: 1,
    scheduled_start: new Date().toISOString(),
    scheduled_end: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  });

  const visitRes = http.post(`${BASE_URL}/telemedicine/visits`, visitPayload, { headers });
  check(visitRes, {
    'visit created': (r) => r.status === 201 || r.status === 200,
  });
  errorRate.add(visitRes.status !== 201 && visitRes.status !== 200);
  latencyTrend.add(visitRes.timings.duration);

  // Record a vital
  const vitalPayload = JSON.stringify({
    patient_id: 1,
    vital_type: 'heart_rate',
    value: 72.0,
    unit: 'bpm',
  });

  const vitalRes = http.post(`${BASE_URL}/monitoring/readings`, vitalPayload, { headers });
  check(vitalRes, {
    'vital recorded': (r) => r.status === 201 || r.status === 200,
  });

  // Send a message
  const msgPayload = JSON.stringify({
    recipient_id: 2,
    body: 'Hello from load test',
  });

  const msgRes = http.post(`${BASE_URL}/portal/messages`, msgPayload, { headers });
  check(msgRes, {
    'message sent': (r) => r.status === 201 || r.status === 200,
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'summary.json': JSON.stringify(data),
  };
}
EOF
echo done