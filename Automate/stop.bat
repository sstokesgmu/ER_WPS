@echo off
echo Stopping Elden Ring Servers...

:: Kill Node.js processes (backend and frontend)
echo Stopping servers...
taskkill /f /im node.exe 2>nul

:: Kill by specific ports as backup
echo Checking for processes on common ports...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :4000') do taskkill /f /pid %%a 2>nul

echo Done! All servers should be stopped.
pause