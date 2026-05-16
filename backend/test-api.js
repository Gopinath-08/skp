const http = require('http');

const endpoints = [
  '/api/courses',
  '/api/faculty',
  '/api/gallery',
  '/api/notices',
  '/api/testimonials',
  '/api/batches'
];

async function testEndpoints() {
  for (const endpoint of endpoints) {
    await new Promise((resolve) => {
      http.get(`http://localhost:5000${endpoint}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.log(`[${res.statusCode}] GET ${endpoint}`);
          try {
            const json = JSON.parse(data);
            console.log(`  Response is valid JSON. Items: ${Array.isArray(json) ? json.length : 'Not an array'}`);
          } catch(e) {
            console.log(`  Response is NOT valid JSON: ${data.substring(0, 50)}...`);
          }
          resolve();
        });
      }).on('error', (err) => {
        console.log(`[ERROR] GET ${endpoint} - ${err.message}`);
        resolve();
      });
    });
  }
}

testEndpoints();
