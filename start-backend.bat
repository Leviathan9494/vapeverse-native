@echo off
echo.
echo ========================================
echo   VapeVerse Backend Starting...
echo ========================================
echo.

cd backend

echo [1/2] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo [2/2] Starting API server...
echo.
echo Backend will run on: http://localhost:3000
echo API accessible at: http://192.168.4.76:3000/api
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start
