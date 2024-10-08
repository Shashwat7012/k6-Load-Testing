import http from 'k6/http';
import { Rate } from 'k6/metrics'; // Import Rate for custom metrics

export let errorRate = new Rate('error'); // custom metric

export let options = {
    stages: [
        { duration: '10s', target: 5000 },  // ramp-up to 5000 users
        { duration: '30s', target: 10000 }, // ramp-up to 10,000 users
        { duration: '30s', target: 10000 }, // stay at 10,000 users
        { duration: '10s', target: 100 },   // ramp-down to 100 users
    ]
};

export default function() {
    let response = http.get('http://localhost:4000/api/v1/todos');

    // Check if the request was successful (status 200)
    let success = response.status === 200;

    // Track error rate if request fails
    errorRate.add(!success);
}
