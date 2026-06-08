#!/bin/bash

# Cloudinary Integration Verification Script

echo "🔍 Cloudinary Integration Verification"
echo "======================================"
echo ""

# Check Node.js version
echo "✅ Checking Node.js version..."
node --version

# Check npm packages
echo ""
echo "✅ Checking installed packages..."
npm list cloudinary multer-storage-cloudinary 2>/dev/null | grep -E "cloudinary|multer-storage"

# Check environment variables
echo ""
echo "✅ Checking Cloudinary environment variables..."
if [ -f .env ]; then
    if grep -q "CLOUDINARY_CLOUD_NAME" .env; then
        echo "   ✅ CLOUDINARY_CLOUD_NAME is set"
    else
        echo "   ❌ CLOUDINARY_CLOUD_NAME is missing"
    fi
    
    if grep -q "CLOUDINARY_API_KEY" .env; then
        echo "   ✅ CLOUDINARY_API_KEY is set"
    else
        echo "   ❌ CLOUDINARY_API_KEY is missing"
    fi
    
    if grep -q "CLOUDINARY_API_SECRET" .env; then
        echo "   ✅ CLOUDINARY_API_SECRET is set"
    else
        echo "   ❌ CLOUDINARY_API_SECRET is missing"
    fi
else
    echo "   ❌ .env file not found"
fi

# Check configuration files
echo ""
echo "✅ Checking configuration files..."
if [ -f config/cloudinary.js ]; then
    echo "   ✅ config/cloudinary.js exists"
else
    echo "   ❌ config/cloudinary.js is missing"
fi

if [ -f middleware/upload.js ]; then
    echo "   ✅ middleware/upload.js exists"
else
    echo "   ❌ middleware/upload.js is missing"
fi

if [ -f utils/fileUpload.js ]; then
    echo "   ✅ utils/fileUpload.js exists"
else
    echo "   ❌ utils/fileUpload.js is missing"
fi

# Check routes
echo ""
echo "✅ Checking route files..."
if grep -q "profileUpload" routes/students.js; then
    echo "   ✅ Student routes use profileUpload"
else
    echo "   ⚠️  Student routes may not be using profileUpload"
fi

if grep -q "profileUpload" routes/faculty.js; then
    echo "   ✅ Faculty routes use profileUpload"
else
    echo "   ⚠️  Faculty routes may not be using profileUpload"
fi

# Check database models
echo ""
echo "✅ Checking database models..."
if grep -q "photo:" models/Student.js; then
    echo "   ✅ Student model has photo field"
else
    echo "   ❌ Student model missing photo field"
fi

if grep -q "tenthCertificate:" models/Student.js; then
    echo "   ✅ Student model has tenthCertificate field"
else
    echo "   ⚠️  Student model missing tenthCertificate field"
fi

if grep -q "photo:" models/Faculty.js; then
    echo "   ✅ Faculty model has photo field"
else
    echo "   ❌ Faculty model missing photo field"
fi

echo ""
echo "======================================"
echo "✅ Verification Complete!"
echo ""
echo "Next steps:"
echo "1. Start the server: npm start"
echo "2. Test the API with: curl -X GET http://localhost:5000/api/students"
echo "3. Check server logs for any errors"
echo ""
