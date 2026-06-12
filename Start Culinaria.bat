@echo off
title Culinaria - dev server
cd /d "%~dp0"
echo.
echo   Starting Culinaria at http://localhost:3000 ...
echo   (keep this window open while using the app; press Ctrl+C to stop)
echo.
start "" cmd /c "timeout /t 7 /nobreak >nul & start http://localhost:3000"
call npm run dev
pause
