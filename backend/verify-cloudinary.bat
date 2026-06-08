@echo off
REM Cloudinary Integration Verification Script for Windows

echo.
echo 🔍 Cloudinary Integration Verification
echo ======================================
echo.

REM Check Node.js version
echo ✅ Checking Node.js version...
node --version
echo.

REM Check npm packages
echo ✅ Checking installed packages...
npm list cloudinary multer-storage-cloudinary 2>nul | findstr /C:"cloudinary" /C:"multer-storage"
echo.

REM Check environment variables
echo ✅ Checking Cloudinary environment variables...
if exist .env (
    findstr "CLOUDINARY_CLOUD_NAME" .env >nul && (
        echo    ✅ CLOUDINARY_CLOUD_NAME is set
    ) || (
        echo    ❌ CLOUDINARY_CLOUD_NAME is missing
    )
    
    findstr "CLOUDINARY_API_KEY" .env >nul && (
        echo    ✅ CLOUDINARY_API_KEY is set
    ) || (
        echo    ❌ CLOUDINARY_API_KEY is missing
    )
    
    findstr "CLOUDINARY_API_SECRET" .env >nul && (
        echo    ✅ CLOUDINARY_API_SECRET is set
    ) || (
        echo    ❌ CLOUDINARY_API_SECRET is missing
    )
) else (
    echo    ❌ .env file not found
)
echo.

REM Check configuration files
echo ✅ Checking configuration files...
if exist config\cloudinary.js (
    echo    ✅ config/cloudinary.js exists
) else (
    echo    ❌ config/cloudinary.js is missing
)

if exist middleware\upload.js (
    echo    ✅ middleware/upload.js exists
) else (
    echo    ❌ middleware/upload.js is missing
)

if exist utils\fileUpload.js (
    echo    ✅ utils/fileUpload.js exists
) else (
    echo    ❌ utils/fileUpload.js is missing
)
echo.

REM Check routes
echo ✅ Checking route files...
findstr "profileUpload" routes\students.js >nul && (
    echo    ✅ Student routes use profileUpload
) || (
    echo    ⚠️  Student routes may not be using profileUpload
)

findstr "profileUpload" routes\faculty.js >nul && (
    echo    ✅ Faculty routes use profileUpload
) || (
    echo    ⚠️  Faculty routes may not be using profileUpload
)
echo.

REM Check database models
echo ✅ Checking database models...
findstr "photo:" models\Student.js >nul && (
    echo    ✅ Student model has photo field
) || (
    echo    ❌ Student model missing photo field
)

findstr "tenthCertificate:" models\Student.js >nul && (
    echo    ✅ Student model has tenthCertificate field
) || (
    echo    ⚠️  Student model missing tenthCertificate field
)

findstr "photo:" models\Faculty.js >nul && (
    echo    ✅ Faculty model has photo field
) || (
    echo    ❌ Faculty model missing photo field
)
echo.

echo ======================================
echo ✅ Verification Complete!
echo.
echo Next steps:
echo 1. Start the server: npm start
echo 2. Test the API with: curl -X GET http://localhost:5000/api/students
echo 3. Check server logs for any errors
echo.
pause
