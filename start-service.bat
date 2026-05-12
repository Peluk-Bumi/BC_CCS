@echo off
REM Start Blockchain Service with auto-restart
REM Location: BE_CCS/blockchain-service/start-service.bat

setlocal enabledelayedexpansion

set SERVICE_DIR=c:\Xampp\htdocs\CCS-project\BE_CCS\blockchain-service
set LOG_FILE=%SERVICE_DIR%\blockchain-service.log
set RETRY_COUNT=0
set MAX_RETRIES=10

echo.
echo ========================================
echo   CCS Blockchain Service Starter
echo ========================================
echo.
echo Location: %SERVICE_DIR%
echo Logs: %LOG_FILE%
echo.

:START
cls
echo.
echo ========================================
echo   Attempt %RETRY_COUNT% of %MAX_RETRIES%
echo ========================================
echo Time: %date% %time%
echo.

cd /d "%SERVICE_DIR%"

echo Starting blockchain service...
echo Time: %date% %time% - Starting blockchain service >> "%LOG_FILE%"

node server.js >> "%LOG_FILE%" 2>&1

echo.
echo ❌ Service crashed or exited!
echo Time: %date% %time% - Service exited >> "%LOG_FILE%"
echo.

if %RETRY_COUNT% LSS %MAX_RETRIES% (
    set /a RETRY_COUNT=!RETRY_COUNT!+1
    echo Waiting 5 seconds before restart...
    timeout /t 5 /nobreak
    goto START
) else (
    echo.
    echo ❌ Max retries reached. Service disabled.
    echo Time: %date% %time% - Max retries reached >> "%LOG_FILE%"
    pause
)
