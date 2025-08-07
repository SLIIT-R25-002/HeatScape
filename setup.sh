#!/bin/bash

# HeatScape Docker Setup Script
# This script helps set up and run the HeatScape services using Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_status "Docker and Docker Compose are installed."
}

# Check if required files exist
check_files() {
    print_status "Checking required files..."
    
    # Check if model weights exist
    if [ ! -d "image-processing-service/weights" ]; then
        print_warning "Model weights directory not found. Creating directory..."
        mkdir -p image-processing-service/weights
        print_warning "Please ensure you place the required model weights in image-processing-service/weights/"
    fi
    
    # Check if .env file exists
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from template..."
        cp .env.template .env
        print_warning "Please edit .env file with your actual API keys and configuration."
    fi
    
    print_status "File check completed."
}

# Build and start services
start_services() {
    local mode=${1:-"development"}
    
    print_status "Starting services in $mode mode..."
    
    if [ "$mode" = "production" ]; then
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
    elif [ "$mode" = "development" ]; then
        docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
    else
        docker-compose up -d --build
    fi
    
    print_status "Services started successfully!"
}

# Show service status
show_status() {
    print_status "Service Status:"
    docker-compose ps
    
    echo ""
    print_status "Service URLs:"
    echo "  Image Processing Service: http://localhost:5001"
    echo "  VLM Solution Service: http://localhost:5002"
    echo "  IoT Localization Service: http://localhost:5003"
}

# Main menu
show_menu() {
    echo ""
    echo "HeatScape Docker Setup"
    echo "====================="
    echo "1. Start services (development mode)"
    echo "2. Start services (production mode)"
    echo "3. Stop services"
    echo "4. View logs"
    echo "5. Check status"
    echo "6. Clean up (remove containers and images)"
    echo "7. Build only"
    echo "8. Exit"
    echo ""
}

# Main script
main() {
    print_status "HeatScape Docker Setup Script"
    
    # Check prerequisites
    check_docker
    check_files
    
    if [ $# -eq 0 ]; then
        # Interactive mode
        while true; do
            show_menu
            read -p "Please select an option (1-8): " choice
            
            case $choice in
                1)
                    start_services "development"
                    show_status
                    ;;
                2)
                    start_services "production"
                    show_status
                    ;;
                3)
                    print_status "Stopping services..."
                    docker-compose down
                    print_status "Services stopped."
                    ;;
                4)
                    print_status "Showing logs (press Ctrl+C to exit)..."
                    docker-compose logs -f
                    ;;
                5)
                    show_status
                    ;;
                6)
                    print_warning "This will remove all containers, networks, and images. Are you sure? (y/N)"
                    read -p "" confirm
                    if [[ $confirm =~ ^[Yy]$ ]]; then
                        docker-compose down -v --rmi all --remove-orphans
                        print_status "Cleanup completed."
                    fi
                    ;;
                7)
                    print_status "Building services..."
                    docker-compose build
                    print_status "Build completed."
                    ;;
                8)
                    print_status "Goodbye!"
                    exit 0
                    ;;
                *)
                    print_error "Invalid option. Please try again."
                    ;;
            esac
        done
    else
        # Command line mode
        case $1 in
            "dev"|"development")
                start_services "development"
                show_status
                ;;
            "prod"|"production")
                start_services "production"
                show_status
                ;;
            "stop")
                docker-compose down
                ;;
            "status")
                show_status
                ;;
            "clean")
                docker-compose down -v --rmi all --remove-orphans
                ;;
            "build")
                docker-compose build
                ;;
            *)
                print_error "Unknown command: $1"
                echo "Usage: $0 [dev|prod|stop|status|clean|build]"
                exit 1
                ;;
        esac
    fi
}

# Run main function
main "$@"
