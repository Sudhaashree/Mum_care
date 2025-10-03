import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import mqtt, { MqttClient } from "mqtt";

const brokerUrl = "ws://192.168.207.190:8083/mqtt"; // 👈 update with your broker's IP:PORT

const TEMPERATURE_LIMIT = 39; 


const Sensor = () => {
  const [temperature, setTemperature] = useState<number>(0);
  const [tempWarning, setTempWarning] = useState<boolean>(false);
  const [heartRate, setHeartRate] = useState<number>(0);
  const [steps, setSteps] = useState<number>(0);

  useEffect(() => {
    const client: MqttClient = mqtt.connect(brokerUrl, {
      clientId: "rn-sensor-" + Math.random().toString(16).slice(2, 8),
      username: "mumcare", // 👈 same credentials as Arduino
      password: "mumcare",
      reconnectPeriod: 1000,
    });

    client.on("connect", () => {
      console.log("✅ Connected to MQTT broker");
      client.subscribe("/temperature/data");
      client.subscribe("/heartbeat/data");
      client.subscribe("/stepcount/data");
    });

    client.on("message", (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());

        if (topic === "/temperature/data") {
          const temp = payload.Temperature;
  setTemperature(temp);

  if (temp > TEMPERATURE_LIMIT) {
    console.warn("🚨 Temperature limit exceeded:", temp);
    // TODO: You can show an alert, trigger a vibration, change UI color, etc.
  }
        } else if (topic === "/heartbeat/data") {
          setHeartRate(payload.Heartbeat);
        } else if (topic === "/stepcount/data") {
          setSteps(payload.Steps);
        }
      } catch (err) {
        console.log("❌ JSON parse error:", err);
      }
    });

    client.on("error", (err) => {
      console.log("❌ MQTT Error:", err);
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FF69B4", "#EC407A"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="pulse" size={28} color="white" />
          <Text style={styles.headerTitle}>Live Sensor Monitor</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <SensorCard
            icon="thermometer"
            label="Temperature"
            value={
    temperature
      ? `${Math.min(temperature, TEMPERATURE_LIMIT).toFixed(1)} °C`
      : "—"
  }
            color="#FF9800"
          />
          <SensorCard
            icon="heart"
            label="Heart Rate"
            value={heartRate ? `${heartRate} bpm` : "—"}
            color="#E91E63"
          />
          <SensorCard
            icon="walk"
            label="Steps"
            value={steps ? `${steps}` : "—"}
            color="#4CAF50"
          />
        </ScrollView>
      </View>
    </View>
  );
};

// Reuse SensorCard
const SensorCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
}) => (
  <View style={styles.card}>
    <View style={[styles.iconContainer, { backgroundColor: color + "33" }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "ios" ? 140 : 120,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: "700",
  },
});

export default Sensor;
