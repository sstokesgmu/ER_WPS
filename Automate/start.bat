@echo off
echo Starting Elden Ring Servers...

@REM ::Start Frontend
@REM start cmd /k "cd ../Frontend && yarn dev"

@REM ::Give Vite a moment to start 
@REM timeout /t 2 /nobreak

:: Start Backend
start cmd /k "cd ../NodeServer && nodemon server.js"
echo Done! Servers are starting up 
