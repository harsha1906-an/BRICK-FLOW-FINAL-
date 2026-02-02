const http = require('http');

const data = JSON.stringify({
    villaNumber: 'V-TEST-LOG',
    houseType: '3BHK',
    status: 'available'
});

const options = {
    hostname: 'localhost',
    port: 8888,
    path: '/api/villa/create',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let body = '';
    res.on('data', (chunk) => {
        body += chunk;
    });
    res.on('end', () => {
        console.log('RESPONSE:', body);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
