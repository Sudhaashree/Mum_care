import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import mqtt, { MqttClient } from 'mqtt';

interface Message {
  topic: string;
  msg: string;
  time: string;
}

const Mqtt: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  useEffect(() => {
    const client: MqttClient = mqtt.connect('ws://192.168.230.190:8083/mqtt', {
      clientId: 'react-native-client-' + Math.random().toString(16).substr(2, 8),
      username: 'mumcare',
      password: 'mumcare',
      clean: true,
      reconnectPeriod: 1000,
    });

    client.on('connect', () => {
      console.log('✅ Connected to MQTT broker');

      // client.subscribe('/temperature/data', (err?: Error) => {
      //   if (!err) {
      //     console.log('✅ Subscribed to',);
      //   } else {
      //     console.log('❌ Subscribe error:', err.message);
      //   }
      // });
      client.subscribe('/stepcount/data', (err?: Error) => {
        if (!err) {
          console.log('✅ Subscribed to',);
        } else {
          console.log('❌ Subscribe error:', err.message);
        }
      });
      client.subscribe('/heartbeat/data', (err?: Error) => {
        if (!err) {
          console.log('✅ Subscribed to',);
        } else {
          console.log('❌ Subscribe error:', err.message);
        }
      });

      client.publish('/hello', 'Hello from React Native via WebSocket');
    });

    client.on('message', (topic: string, message: Buffer) => {
      const msg = message.toString();
      console.log(`📥 Message received: ${topic} - ${msg}`);

      setMessages((prev) => [
        ...prev,
        { topic, msg, time: new Date().toLocaleTimeString() },
      ]);
      setLastMessage(msg);
    });

    client.on('error', (err: Error) => {
      console.log('❌ MQTT Error:', err);
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MQTT WebSocket Client</Text>

      <Text style={styles.label}>Last Message:</Text>
      <Text style={styles.lastMsg}>
        {lastMessage || 'Waiting for messages...'}
      </Text>

      <Text style={styles.label}>All Messages:</Text>
      <ScrollView style={styles.scroll}>
        {messages.map((item, index) => (
          <Text key={index} style={styles.msg}>
            [{item.time}] {item.topic}: {item.msg}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  label: { fontSize: 16, marginTop: 10, fontWeight: '600' },
  lastMsg: { fontSize: 16, color: 'blue', marginVertical: 5 },
  scroll: { marginTop: 10, backgroundColor: '#fff', padding: 10, borderRadius: 6 },
  msg: { fontSize: 14, marginVertical: 2 },
});

export default Mqtt;
