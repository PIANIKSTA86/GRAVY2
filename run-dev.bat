@echo off
rem Launcher Windows para desarrollo local
set DATABASE_URL=mysql://root@localhost:3306/gravy2
set SESSION_SECRET=8f6c2a9f9d5c4c0b8a1c4f2d7e3b1a0c
set ISSUER_URL=https://replit.com/oidc
set REPL_ID=dummy-local
set NODE_ENV=development
set DEV_AUTH_BYPASS=true
cd /d D:\Proyectos\ContaGrav2
npm run dev:win
