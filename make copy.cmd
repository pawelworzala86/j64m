@echo off

;;node compile.js %1
IF ERRORLEVEL 1 GOTO koniec

del out\%1.exe

set include=C:\fasmg\packages\x86\include
C:\fasmg\core\fasmg asm\%1.asm out\%1.exe
IF ERRORLEVEL 1 GOTO koniec

@echo on

cd out
%1.exe
cd ..

:koniec