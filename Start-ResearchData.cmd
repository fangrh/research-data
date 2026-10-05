@echo off
setlocal
if not exist "%~dp0.venv\Scripts\python.exe" (
    echo Installing ResearchData for the first launch. Python 3.11+ and internet are required.
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\setup.ps1"
    if errorlevel 1 goto failed
)
call "%~dp0research-data.cmd" open %*
if errorlevel 1 goto failed
exit /b 0
:failed
echo.
echo ResearchData could not open. See the error above or run research-data.cmd doctor.
pause
exit /b 2
