# HeatScape Docker Setup

This directory contains Docker configurations for the HeatScape services. The following services are containerized:

- **Image Processing Service** (Port 5001) - Computer vision and image analysis
- **VLM Solution Service** (Port 5002) - Machine learning predictions and Gemini AI integration  
- **IoT Localization Service** (Port 5003) - SuperGlue feature matching for localization
- **UHI Simulation Service** (Port 4200) - Urban Heat Island simulation and MATLAB integration

## Prerequisites

- Docker
- Docker Compose
- Required model files and weights (see individual service documentation)

## Quick Start

1. **Clone the repository and navigate to the HeatScape directory**
   ```bash
   cd HeatScape
   ```

2. **Set up environment variables**
   ```bash
   cp .env.template .env
   # Edit .env file with your actual API keys and configuration
   ```

3. **Build and run all services**
   ```bash
   docker-compose up --build
   ```

4. **Run in background (detached mode)**
   ```bash
   docker-compose up -d --build
   ```

## Service Endpoints

- Image Processing Service: http://localhost:5001
- VLM Solution Service: http://localhost:5002  
- IoT Localization Service: http://localhost:5003
- UHI Simulation Service: http://localhost:4200

## Individual Service Commands

### Build specific service
```bash
docker-compose build image-processing-service
docker-compose build vlm-solution-service
docker-compose build iot-localization-service
docker-compose build uhi-simulation-service
```

### Run specific service
```bash
docker-compose up image-processing-service
docker-compose up vlm-solution-service
docker-compose up iot-localization-service
```

### View logs
```bash
docker-compose logs image-processing-service
docker-compose logs vlm-solution-service
docker-compose logs iot-localization-service
```

## Service Details

### Image Processing Service
- **Port**: 5001 (mapped from container port 5000)
- **Dependencies**: OpenCV, PyTorch, YOLO, Segment Anything
- **Volumes**: 
  - `./image-processing-service/uploads:/app/uploads` - Upload directory
  - `./image-processing-service/weights:/app/weights` - Model weights

### VLM Solution Service  
- **Port**: 5002 (mapped from container port 5000)
- **Dependencies**: Flask, scikit-learn, Gemini AI
- **Environment**: Requires `GEMINI_API_KEY`

### IoT Localization Service
- **Port**: 5003 (mapped from container port 5000)
- **Dependencies**: OpenCV, PyTorch, SuperGlue models
- **Features**: Feature matching and localization

## Development

### Access container shell
```bash
docker-compose exec image-processing-service bash
docker-compose exec vlm-solution-service bash
docker-compose exec iot-localization-service bash
```

### Rebuild after code changes
```bash
docker-compose up --build
```

### Stop all services
```bash
docker-compose down
```

### Remove containers and volumes
```bash
docker-compose down -v
```

## Troubleshooting

1. **Port conflicts**: If ports are already in use, modify the port mappings in `docker-compose.yml`

2. **Missing model files**: Ensure model weights are present in the respective directories:
   - `image-processing-service/weights/`
   - `vlm-solution-service/backend/` (for ML models)

3. **API Key issues**: Verify your `.env` file contains the correct `GEMINI_API_KEY`

4. **Memory issues**: The image processing service requires significant memory for ML models. Increase Docker memory allocation if needed.

5. **Build failures**: Check logs with `docker-compose logs [service-name]` for specific error messages

## Production Considerations

- Use a reverse proxy (nginx) for load balancing and SSL termination
- Implement proper logging and monitoring
- Use Docker secrets for sensitive environment variables
- Consider using multi-stage builds to reduce image sizes
- Implement health checks for better container orchestration

## Network Architecture

All services run on a custom Docker network (`heatscape-network`) allowing inter-service communication using service names as hostnames.
