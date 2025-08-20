import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 1 minute
    { duration: '3m', target: 100 }, // stay at 100 users for 3 minutes
    { duration: '1m', target: 0 },  // ramp-down to 0 users
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'], // 95% of requests should be below 500ms
    'http_req_failed': ['rate<0.01'],  // http errors should be less than 1%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export default function () {
  // Test Health Check endpoint
  let res = http.get(`${BASE_URL}/health`);
  check(res, { 'health check status is 200': (r) => r.status === 200 });

  // Test Auth Signup endpoint
  const signupPayload = JSON.stringify({
    email: `test-${__VU}-${__ITER}@example.com`,
    password: 'password123',
  });
  res = http.post(`${BASE_URL}/auth/signup`, signupPayload, { headers: { 'Content-Type': 'application/json' } });
  check(res, { 'signup status is 201': (r) => r.status === 201 });

  // Test Auth Signin endpoint
  const signinPayload = JSON.stringify({
    email: `test-${__VU}-${__ITER}@example.com`,
    password: 'password123',
  });
  res = http.post(`${BASE_URL}/auth/signin`, signinPayload, { headers: { 'Content-Type': 'application/json' } });
  check(res, { 'signin status is 200': (r) => r.status === 200 });

  // Test Health Guides endpoint
  res = http.get(`${BASE_URL}/health-guides`);
  check(res, { 'health guides status is 200': (r) => r.status === 200 });

  // Test Products endpoint
  res = http.get(`${BASE_URL}/products`);
  check(res, { 'products status is 200': (r) => r.status === 200 });

  sleep(1);
}


