@echo off
REM Blockchain Broadcaster Service Starter for Windows

setlocal enabledelayedexpansion

set SERVICE_NAME=CCS-Blockchain-Broadcaster
set NODE_SCRIPT=C:\Xampp\htdocs\CCS-project\BE_CCS\blockchain-service\server.js
set LOG_FILE=C:\Xampp\htdocs\CCS-project\BE_CCS\blockchain-service\blockchain-service-startup.log

echo [%date% %time%] Starting blockchain broadcaster service... >> "%LOG_FILE%"

REM Check if port 4000 is already in use
netstat -ano | findstr ":4000" >nul
if !errorlevel! equ 0 (
    echo [%date% %time%] Port 4000 already in use, skipping startup >> "%LOG_FILE%"
    exit /b 0
)

REM Start Node.js service
cd /d C:\Xampp\htdocs\CCS-project\BE_CCS\blockchain-service
node server.js >> "%LOG_FILE%" 2>&1

echo [%date% %time%] Broadcaster startup script completed >> "%LOG_FILE%"
