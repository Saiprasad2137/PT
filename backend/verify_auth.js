const http = require('http');

function request(path, method, body, callback) {
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: path,
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': body ? Buffer.byteLength(body) : 0
        }
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log(`Response for ${path}: ${res.statusCode}`);
            console.log(data);
            if (callback) callback();
        });
    });

    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
    });

    if (body) {
        req.write(body);
    }
    req.end();
}

const user = JSON.stringify({
    name: 'Verification User',
    email: 'verify@example.com',
    password: 'password123'
});

const login = JSON.stringify({
    email: 'verify@example.com',
    password: 'password123'
});

console.log('--- Registering User ---');
request('/api/auth/register', 'POST', user, () => {
    console.log('\n--- Logging In ---');
    request('/api/auth/login', 'POST', login, () => { });
});
