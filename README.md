
# 🔥 HeatScape – AI-Driven Detection and Mitigation of Urban Heat Island Effects

## 🌍 Main Objective
To develop **HeatScape**, a comprehensive system that leverages image analysis, IoT, Digital twin technology and AI to detect and mitigate Urban Heat Island (UHI) effects. HeatScape uses a mobile robotic platform equipped with environmental sensors and computer vision to autonomously collect temperature data, analyze heat patterns, and simulate urban development scenarios for sustainable planning.

---

## ❓ Main Research Questions
1. How can computer vision and thermal imaging be used to accurately detect and classify urban heat sources?
2. In what ways can a mobile IoT device with autonomous navigation enhance temperature data collection in large urban areas?
3. How can Visual Language Models (VLMs) and Explainable AI (XAI) contribute to understanding and mitigating UHI effects?
4. What is the impact of new building constructions on UHI, and how can 3D simulations help optimize future urban planning?

---

## 🔍 Individual Research Questions & Objectives

### 🖼️ Image Analysis
- **Research Question**: How can deep learning-based object detection and segmentation be utilized to identify and analyze urban surface materials contributing to Urban Heat Island (UHI) effects?
- **Objectives**:
  - Develop a mobile application for capturing urban scene images and performing on-device segmentation using models like YOLOv8 and SAM.
  - Detect and segment key urban components.
  - Classify materials using segmented regions.
  - Calculate surface areas.


### 🔧 IoT & Navigation
- **Research Question**: How can SLAM and thermal imaging be integrated in a mobile IoT device for efficient, automated temperature mapping of urban environments?
- **Objectives**:
  - Develop a mobile robot with SLAM for autonomous navigation.
  - Integrate GPS, gyroscope, and thermal sensors for location-aware temperature logging.
  - Implement image-based object matching for accurate temperature data alignment.
  - Optimize communication and power systems for long-duration outdoor operation.

### 📊 VLM & Data Processing
- **Research Question**: How can Visual Language Models (VLMs) and Explainable AI improve interpretation of heat data and suggest actionable mitigation strategies for Urban Heat Island (UHI) effects?
- **Objectives**:
  - Integrate segmented image data and environmental metrics (temperature, surface temperature, humidity, surface area) into a VLM pipeline.
  - Use prompt engineering with models like BLIP-2 or GPT-4-V to:
    - Determine whether a location exhibits UHI effects.
    - Generate clear, example-based mitigation suggestions (e.g., "Example – A red metal roof with no shade; Answer – Apply white reflective coating and install shading plants.").
  - Apply Explainable AI (XAI) to highlight which elements in the image influenced the model’s decision and recommendation.

### 🏙️ Urban Simulation
- **Research Question**: How can an integrated real-time simulation tool combining Digital twins, GIS data and dynamic environmental parameters be developed for Urban Heat Island analysis?
- **Objectives**:
  - Develop Digital twin models and 3D models of urban environments using simulation software.
  - Develop simulation tool that integrate high resolution GIS data, Environmental data and Digital twin model. 
  - Provide Thermal Impact analysis to guide mitigation planning.

---

## 🔩 Technologies Used
- **Hardware**: ESP32-CAM, MLX90640 (Thermal Sensor), RPLiDAR A1, MPU6050/BNO055 (IMU), GY-NEO6MV2 (GPS), DC Motors with Encoders, Servo Mount
- **Software**: Python, Arduino, C++, React Native (Mobile App), MQTT (Communication), ROS (SLAM), SuperGlue (Feature Matching), Visual Language Models (e.g., BLIP), Unity/Blender (Simulation)
- **Platforms**: GitHub, Firebase/Backend, Cloud APIs

---

## 🧭 System Architecture Overview
1. **Image Analysis**: Users capture segmented images with a mobile app.
2. **SLAM Navigation**: IoT robot autonomously travels to target locations.
3. **Object Matching & Temp Sensing**: Robot aligns with segmented objects and measures temperature.
4. **Data Transmission**: Data sent to the backend and processed using VLMs.
5. **Simulation**: Urban simulations predict UHI impact of different development plans.

---

## 🚀 Project Status
- ✅ Manual car control and temperature data collection complete
- 🔄 SLAM-based navigation and object localization in development
- 🔜 Integration with mobile app and image segmentation database
- 🔜 Finalizing VLM and simulation components

---

## 👥 Team Members
- **Sachinthaka Ayeshmantha** – IoT & Navigation
- **Avishka Nuwan** – Image Analysis
- **Sandithya Sasmini** – VLM & Data Processing
- **Osadha Madhuwantha** – Urban Simulation

---

## Steps to Clone and Initialize the Repository

Follow these steps to set up the project from scratch:

### 1. Clone the Main Repository
```bash
git clone https://github.com/SLIIT-R25-002/HeatScape.git
cd HeatScape
```

### 2. Initialize and Update Submodules
To fetch the content of all submodules, run:
```bash
git submodule update --init --recursive
```

If you only want to fetch a specific submodule (e.g., `iot-localization-service`), run:
```bash
git submodule update --init iot-localization-service
```

### 3. Navigate to a Specific Service
To work on a specific service, navigate to its directory. For example:
```bash
cd iot-localization-service
```

After navigating, follow the `README.md` file in that specific service's directory for further instructions.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
