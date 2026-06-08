const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

// Helper function to log results
const log = (title, data) => {
  console.log('\n' + '='.repeat(50));
  console.log(title);
  console.log('='.repeat(50));
  console.log(JSON.stringify(data, null, 2));
};

// Test Admin Login
const testAdminLogin = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@ideal.com',
      password: 'admin123'
    });
    authToken = response.data.token;
    log('✅ Admin Login Successful', response.data);
    return true;
  } catch (error) {
    log('❌ Admin Login Failed', error.response?.data || error.message);
    return false;
  }
};

// Test Create Student with Photo
const testCreateStudent = async () => {
  try {
    const formData = new FormData();
    
    // Add student data
    formData.append('fullName', 'Test Student');
    formData.append('parentsName', 'Parent Name');
    formData.append('motherName', 'Mother Name');
    formData.append('parentNumber', '9999999999');
    formData.append('dob', '2000-01-15');
    formData.append('gender', 'Male');
    formData.append('mobile', '9876543210');
    formData.append('email', 'student@test.com');
    formData.append('aadhaar', '123456789012');
    formData.append('qualification', '12th Pass');
    formData.append('address', 'Test Address');
    formData.append('state', 'Odisha');
    formData.append('district', 'Balangir');
    formData.append('pinCode', '767033');
    formData.append('branch', 'Titilagarh');
    formData.append('studentCategory', 'General');
    formData.append('courseId', '1');

    // Add a test image file if it exists
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    if (fs.existsSync(testImagePath)) {
      formData.append('photo', fs.createReadStream(testImagePath));
    }

    const response = await axios.post(`${BASE_URL}/students`, formData, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        ...formData.getHeaders ? formData.getHeaders() : {}
      }
    });

    log('✅ Student Creation Successful', response.data);
    return response.data.data?.id;
  } catch (error) {
    log('❌ Student Creation Failed', error.response?.data || error.message);
    return null;
  }
};

// Test Create Faculty with Photo
const testCreateFaculty = async () => {
  try {
    const formData = new FormData();
    
    // Add faculty data
    formData.append('name', 'Test Faculty');
    formData.append('email', 'faculty@test.com');
    formData.append('phone', '9876543210');
    formData.append('designation', 'Lecturer');
    formData.append('qualification', 'B.Tech');
    formData.append('experience', '5 years');

    // Add a test image file if it exists
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    if (fs.existsSync(testImagePath)) {
      formData.append('photo', fs.createReadStream(testImagePath));
    }

    const response = await axios.post(`${BASE_URL}/faculty`, formData, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        ...formData.getHeaders ? formData.getHeaders() : {}
      }
    });

    log('✅ Faculty Creation Successful', response.data);
    return response.data.data?.id;
  } catch (error) {
    log('❌ Faculty Creation Failed', error.response?.data || error.message);
    return null;
  }
};

// Test Get Student
const testGetStudent = async (studentId) => {
  if (!studentId) {
    log('⚠️  Skipping Get Student (No ID provided)');
    return;
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/students/${studentId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    log('✅ Get Student Successful', response.data);
    
    // Check if photo URL is from Cloudinary
    if (response.data.photo) {
      const isCloudinary = response.data.photo.includes('cloudinary');
      log('📸 Photo URL', {
        url: response.data.photo,
        isCloudinary: isCloudinary,
        status: isCloudinary ? '✅ Stored in Cloudinary' : '📂 Stored locally'
      });
    }
  } catch (error) {
    log('❌ Get Student Failed', error.response?.data || error.message);
  }
};

// Test Get Faculty
const testGetFaculty = async (facultyId) => {
  if (!facultyId) {
    log('⚠️  Skipping Get Faculty (No ID provided)');
    return;
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/faculty/${facultyId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    log('✅ Get Faculty Successful', response.data);
    
    // Check if photo URL is from Cloudinary
    if (response.data.photo) {
      const isCloudinary = response.data.photo.includes('cloudinary');
      log('📸 Photo URL', {
        url: response.data.photo,
        isCloudinary: isCloudinary,
        status: isCloudinary ? '✅ Stored in Cloudinary' : '📂 Stored locally'
      });
    }
  } catch (error) {
    log('❌ Get Faculty Failed', error.response?.data || error.message);
  }
};

// Main test runner
const runTests = async () => {
  console.log('\n🧪 STARTING CLOUDINARY INTEGRATION TESTS\n');
  
  // Test 1: Login
  const loginSuccess = await testAdminLogin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }

  // Test 2: Create Student
  console.log('\n📚 Testing Student Creation...');
  const studentId = await testCreateStudent();

  // Test 3: Create Faculty
  console.log('\n👨‍🏫 Testing Faculty Creation...');
  const facultyId = await testCreateFaculty();

  // Test 4: Get Student (verify photo URL)
  if (studentId) {
    console.log('\n📚 Verifying Student Photo Storage...');
    await testGetStudent(studentId);
  }

  // Test 5: Get Faculty (verify photo URL)
  if (facultyId) {
    console.log('\n👨‍🏫 Verifying Faculty Photo Storage...');
    await testGetFaculty(facultyId);
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ TEST SUITE COMPLETED');
  console.log('='.repeat(50) + '\n');
};

// Run tests
runTests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
