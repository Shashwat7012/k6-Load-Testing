import http from 'k6/http';
import { sleep } from 'k6'; // sleep in loop
import { Rate } from 'k6/metrics'; // error rate

export let errorRate = new Rate('error'); // custom metric

export let options = {
    vus: 1000, // virtual users
    duration: '1m',
    thresholds: {
        'error': ['rate<0.01'], // we want the errors to be less than 1%,
        'http_req_duration': ['p(95)<50'] // 95% of req should complete within 500ms
    }
};

export default function() {
    let response = http.get('http://localhost:4000/api/v1/todos');

    let success = response.status === 200;

    errorRate.add(!success);

    sleep(1/100); // in 1s, 100 req.
}
