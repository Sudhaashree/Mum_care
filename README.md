# 🤰 MUM_CARE

**MUM_CARE** is a mobile app built with **React Native** to support pregnant women by helping them track their medications and monitor their health in real time.  
It connects to IoT sensors via **MQTT** to display live **heart rate** and **body temperature**, making pregnancy care easier and more informed.

---

## ✨ Features

- 💊 **Medication Management**
  - Add, edit, and delete medications
  - Choose frequency & duration (once daily, twice daily, etc.)
  - Smart reminders with push notifications

- 🫀 **Real-Time Vitals Monitoring**
  - Live **heart rate** and **body temperature**
  - Visual indicators on a human body diagram
  - Data fetched via **MQTT broker** from IoT sensors

- 🔔 **Smart Notifications**
  - Medication time reminders
  - Low supply & refill alerts

- 📅 **Health Tracking**
  - Store start date and duration for each medicine
  - Easily track compliance

- 🖌 **Beautiful UI**
  - Gradient headers, easy navigation, pregnancy-friendly design

---

## 🛠️ Tech Stack

| Category         | Technology |
|-----------------|------------|
| **Framework**   | [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/) |
| **Navigation**  | [Expo Router](https://expo.github.io/router/) |
| **UI**          | React Native Paper / Ionicons / Custom Components |
| **Real-time Data** | [MQTT.js](https://github.com/mqttjs/MQTT.js) |
| **Notifications** | [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) |
| **Storage**     | AsyncStorage (or SQLite) |
| **Build**       | Gradle + Java 17 |

---

## 📡 Architecture Overview

```mermaid
flowchart LR
    subgraph MobileApp[📱 MUM_CARE App]
    A[Medication Manager] --> B[Reminder Scheduler]
    B -->|Push Notifications| A
    C[MQTT Client] --> D[Vitals UI]
    end

    subgraph IoT_Sensors[IoT Devices]
    E[Heart Rate Sensor] -->|MQTT Publish| F((MQTT Broker))
    G[Temperature Sensor] -->|MQTT Publish| F
    end

    F -->|MQTT Subscribe| C
