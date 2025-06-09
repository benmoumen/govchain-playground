const crypto = require('crypto');

// Test payload
const payload = {
  session_id: "11111111-2222-3333-4444-555555555555",
  status: "Approved",
  created_at: Math.floor(Date.now() / 1000),
  timestamp: Math.floor(Date.now() / 1000),
  workflow_id: "11111111-2222-3333-4444-555555555555",
  vendor_data: "test-vendor-data",
  decision: {
    session_id: "11111111-2222-3333-4444-555555555555",
    status: "Approved",
    id_verification: {
      status: "Approved",
      document_type: "Identity Card",
      first_name: "John",
      last_name: "Doe",
      date_of_birth: "1990-01-01"
    }
  }
};

const payloadString = JSON.stringify(payload);
const secret = 'test-secret-key-12345';
const timestamp = Math.floor(Date.now() / 1000);

// Generate signature
const hmac = crypto.createHmac('sha256', secret);
const signature = hmac.update(payloadString).digest('hex');

console.log('Payload:', payloadString);
console.log('Signature:', signature);
console.log('Timestamp:', timestamp);

// Create curl command
const curlCommand = `curl -X POST http://localhost:3000/api/didit/webhook \\
  -H "Content-Type: application/json" \\
  -H "X-Signature: ${signature}" \\
  -H "X-Timestamp: ${timestamp}" \\
  -d '${payloadString.replace(/'/g, "'\"'\"'")}'`;

console.log('\nCurl command:');
console.log(curlCommand);
