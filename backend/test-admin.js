const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

const email = process.env.ADMIN_EMAIL || process.env.DEFAULT_ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD || process.env.DEFAULT_ADMIN_PASSWORD;

if (!email || !password) {
  console.error('❌ Error: ADMIN_EMAIL/DEFAULT_ADMIN_EMAIL and ADMIN_PASSWORD/DEFAULT_ADMIN_PASSWORD must be defined in your environment variables (e.g. backend/.env file).');
  console.error('   Please configure them to run this script.');
  process.exit(1);
}

const credentials = {
  email,
  password
};


async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP error ${response.status}: ${text}`);
  }
  return response.json();
}

async function runTest() {
  try {
    console.log('1. Logging in as Admin...');
    const loginRes = await fetchJSON(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const token = loginRes.token;
    console.log('   ✅ Login successful!');

    const headers = { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    console.log('2. Creating a new Faculty member...');
    const facultyRes = await fetchJSON(`${API_URL}/faculty`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: 'Ravi Sharma',
        designation: 'Senior Instructor',
        email: `ravi.sharma.${Date.now()}@idealedu.com`,
        phone: '9876543210',
        experience: '8 Years',
        qualification: 'MCA'
      })
    });
    const facultyId = facultyRes.id || facultyRes._id || facultyRes.data?.id; // accommodate various response structures
    console.log('   ✅ Faculty created.');

    console.log('3. Creating a new Course...');
    const courseRes = await fetchJSON(`${API_URL}/courses`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: 'Advanced Full Stack Web Development',
        code: 'FSWD-Pro',
        category: 'Advanced',
        duration: '6 Months',
        fees: 25000,
        description: 'Learn React, Node.js, and PostgreSQL from scratch.'
      })
    });
    // Let's get the courseId by fetching courses since sequelize create might return standard object
    const allCourses = await fetchJSON(`${API_URL}/courses`, { headers });
    const courseId = allCourses[allCourses.length - 1].id;
    console.log('   ✅ Course created with ID:', courseId);

    console.log('4. Creating a Batch...');
    const batchRes = await fetchJSON(`${API_URL}/batches`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: 'Morning Alpha Batch',
        schedule: 'Mon-Wed-Fri',
        timing: '09:00 AM - 11:00 AM',
        capacity: 30,
        courseId: courseId,
        facultyId: facultyId
      })
    });
    const allBatches = await fetchJSON(`${API_URL}/batches`, { headers });
    const batchId = allBatches[allBatches.length - 1].id;
    console.log('   ✅ Batch created with ID:', batchId);

    console.log('5. Registering a Student...');
    await fetchJSON(`${API_URL}/students`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        admissionId: 'ICE' + Date.now().toString().slice(-6),
        fullName: 'Aarav Patel',
        parentsName: 'Vikram Patel',
        dob: '2001-05-14',
        gender: 'Male',
        mobile: '9123456789',
        email: 'aarav.patel@example.com',
        aadhaar: '1234-5678-9012',
        qualification: 'BCA',
        address: '123 Main St, Tech City',
        courseId: courseId,
        batchId: batchId,
        status: 'Active'
      })
    });
    const allStudents = await fetchJSON(`${API_URL}/students`, { headers });
    const studentId = allStudents[allStudents.length - 1].id;
    console.log('   ✅ Student created with ID:', studentId);

    console.log('6. Creating Fee Record for Student...');
    await fetchJSON(`${API_URL}/fees`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        studentId: studentId,
        courseId: courseId,
        totalFees: 25000,
        paidAmount: 5000,
        discount: 2000,
        paymentMethod: 'UPI'
      })
    });
    const allFees = await fetchJSON(`${API_URL}/fees`, { headers });
    const feeId = allFees[allFees.length - 1].id;
    console.log('   ✅ Fee record created with ID:', feeId);

    console.log('7. Paying an installment...');
    const targetFee = allFees[allFees.length - 1];
    const newPaid = parseFloat(targetFee.paidAmount || 0) + 5000;
    await fetchJSON(`${API_URL}/fees/${feeId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ paidAmount: newPaid })
    });
    console.log('   ✅ Paid another Rs. 5000 towards fees.');

    console.log('8. Generating Certificate...');
    await fetchJSON(`${API_URL}/certificates`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        certificateNumber: 'CERT-' + Date.now().toString().slice(-6),
        studentId: studentId,
        courseId: courseId,
        grade: 'A+',
        issueDate: '2026-05-17'
      })
    });
    console.log('   ✅ Certificate created.');

    console.log('=== ALL TESTS COMPLETED SUCCESSFULLY ===');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

runTest();
