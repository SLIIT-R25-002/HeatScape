@echo off
REM HeatScape Docker Setup Script for Windows
REM This script helps set up and run the HeatScape services using Docker

title HeatScape Docker Setup

:check_docker
echo [INFO] Checking Docker installation...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo [INFO] Docker and Docker Compose are installed.

:check_files
echo [INFO] Checking required files...

if not exist "image-processing-service\weights" (
    echo [WARNING] Model weights directory not found. Creating directory...
    mkdir "image-processing-service\weights"
    echo [WARNING] Please ensure you place the required model weights in image-processing-service\weights\
)

if not exist ".env" (
    echo [WARNING] .env file not found. Creating from template...
    copy ".env.template" ".env"
    echo [WARNING] Please edit .env file with your actual API keys and configuration.
)

echo [INFO] File check completed.

:menu
cls
echo.
echo HeatScape Docker Setup
echo =====================
echo 1. Start services (development mode)
echo 2. Start services (production mode)
echo 3. Stop services
echo 4. View logs
echo 5. Check status
echo 6. Clean up (remove containers and images)
echo 7. Build only
echo 8. Exit
echo.

set /p choice="Please select an option (1-8): "

if "%choice%"=="1" goto dev_mode
if "%choice%"=="2" goto prod_mode
if "%choice%"=="3" goto stop_services
if "%choice%"=="4" goto view_logs
if "%choice%"=="5" goto check_status
if "%choice%"=="6" goto cleanup
if "%choice%"=="7" goto build_only
if "%choice%"=="8" goto exit_script
echo [ERROR] Invalid option. Please try again.
pause
goto menu

:dev_mode
echo [INFO] Starting services in development mode...
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
goto show_status

:prod_mode
echo [INFO] Starting services in production mode...
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
goto show_status

:stop_services
echo [INFO] Stopping services...
docker-compose down
echo [INFO] Services stopped.
pause
goto menu

:view_logs
echo [INFO] Showing logs (press Ctrl+C to exit)...
docker-compose logs -f
goto menu

:check_status
:show_status
echo [INFO] Service Status:
docker-compose ps
echo.
echo [INFO] Service URLs:
echo   Image Processing Service: http://localhost:5001
echo   VLM Solution Service: http://localhost:5002
echo   IoT Localization Service: http://localhost:5003
echo.
pause
goto menu

:cleanup
echo [WARNING] This will remove all containers, networks, and images. Are you sure? (y/N)
set /p confirm="Continue? "
if /i "%confirm%"=="y" (
    docker-compose down -v --rmi all --remove-orphans
    echo [INFO] Cleanup completed.
) else (
    echo [INFO] Cleanup cancelled.
)
pause
goto menu

:build_only
echo [INFO] Building services...
docker-compose build
echo [INFO] Build completed.
pause
goto menu

:exit_script
echo [INFO] Goodbye!
pause
exit /b 0
