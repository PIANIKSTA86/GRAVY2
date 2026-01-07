@echo off
rem Launcher Windows para desarrollo local
set DATABASE_URL=mysql://root@localhost:3306/gravy2
set SESSION_SECRET=8f6c2a9f9d5c4c0b8a1c4f2d7e3b1a0c
set NODE_ENV=development
cd /d D:\Proyectos\ContaGrav2
npm run dev:win
