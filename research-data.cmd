@echo off
setlocal
set "RD_PYTHON=%~dp0.venv\Scripts\python.exe"
if not exist "%RD_PYTHON%" (
    echo ResearchData is not installed in this checkout.
    echo Double-click Start-ResearchData.cmd to install and open it.
    echo Or run: powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\setup.ps1"
    exit /b 2
)
"%RD_PYTHON%" -m research_data %*
exit /b %errorlevel%
