@echo off
echo Starting Elden Ring Servers...

::Start Frontend
start cmd /k "cd ../Frontend && yarn dev"

::Give Vite a moment to start 
timeout /t 2 /nobreak

:: Start Backend
start cmd /k "cd ../NodeServer && npm run dev"
echo Done! Servers are starting up 
