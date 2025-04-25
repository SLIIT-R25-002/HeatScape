# 🔥 HeatScape – AI-Driven Detection and Mitigation of Urban Heat Island Effects

## 🌍 Main Objective
To develop **HeatScape**, a comprehensive system that leverages image analysis, IoT, and AI to detect and mitigate Urban Heat Island (UHI) effects. HeatScape uses a mobile robotic platform equipped with environmental sensors and computer vision to autonomously collect temperature data, analyze heat patterns, and simulate urban development scenarios for sustainable planning.

---

## ❓ Main Research Questions
1. How can computer vision and thermal imaging be used to accurately detect and classify urban heat sources?
2. In what ways can a mobile IoT device with autonomous navigation enhance temperature data collection in large urban areas?
3. How can Visual Language Models (VLMs) and Explainable AI (XAI) contribute to understanding and mitigating UHI effects?
4. What is the impact of new building constructions on UHI, and how can 3D simulations help optimize future urban planning?

---

## 🔍 Individual Research Questions & Objectives

### 🖼️ Image Analysis (Team Member 1)
- **Research Question**: How can image segmentation be used to classify materials and surfaces contributing to UHI?
- **Objectives**:
  - Design a mobile app for image capture and automatic segmentation.
  - Identify surface types (e.g., concrete, vegetation, asphalt) from photos.
  - Store and manage segmented data for IoT integration and analysis.

### 🔧 IoT & Navigation (Sachinthaka Ayeshmantha)
- **Research Question**: How can SLAM and thermal imaging be integrated in a mobile IoT device for efficient, automated temperature mapping of urban environments?
- **Objectives**:
  - Develop a mobile robot with SLAM for autonomous navigation.
  - Integrate GPS, gyroscope, and thermal sensors for location-aware temperature logging.
  - Implement image-based object matching for accurate temperature data alignment.
  - Optimize communication and power systems for long-duration outdoor operation.

### 📊 Data Processing with VLMs (Team Member 2)
- **Research Question**: How can Visual Language Models and Explainable AI improve interpretation of heat data and suggest mitigation strategies?
- **Objectives**:
  - Integrate collected temperature and image data into a VLM pipeline.
  - Use prompt engineering for heat island detection and mitigation suggestion generation.
  - Apply Explainable AI to validate and justify system recommendations.

### 🏙️ Urban Simulation (Team Member 3)
- **Research Question**: How can 3D urban simulation be used to predict the impact of construction on urban heat distribution?
- **Objectives**:
  - Develop 3D models of urban environments using simulation software.
  - Model UHI effects with and without proposed infrastructure.
  - Provide visual simulations to guide mitigation planning.

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
- **[Name]** – Image Analysis
- **[Name]** – VLM & Data Processing
- **[Name]** – Urban Simulation

---

## 📌 How to Run the Project (Coming Soon)
Setup instructions, hardware configurations, and software dependencies will be added as we finalize each module.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
