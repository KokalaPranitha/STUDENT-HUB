@echo off
echo ========================================================
echo Starting StudentHub Spring Boot Backend...
echo ========================================================

cd /d "%~dp0backend"

where mvn >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo Using system Maven...
    mvn spring-boot:run
) else (
    echo Using included Maven Wrapper (mvnw.cmd)...
    call mvnw.cmd spring-boot:run
)
pause
