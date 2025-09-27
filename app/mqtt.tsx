import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import mqtt from 'mqtt';

const Mqtt = () => {
  useEffect(() => {
    const client = mqtt.connect('ws://172.22.161.188:8083/mqtt', {
  clientId: 'react-native-client-' + Math.random().toString(16).substr(2, 8),
  username: 'arduino',
  password: 'love',
  clean: true,
  reconnectPeriod: 1000,
});


    client.on('connect', () => {
      console.log('✅ Connected to MQTT broker');

      client.subscribe('/heartbeat', (err) => {
        if (!err) {
          console.log('✅ Subscribed to /heartbeat');
        } else {
          console.log('❌ Subscribe error:', err.message);
        }
      }); 

      client.publish('/hello', 'Hello from React Native via WebSocket');
    });

    client.on('message', (topic, message) => {
      console.log(`📥 Message received: ${topic} - ${message.toString()}`);
    });

    client.on('error', (err) => {
      console.log('❌ MQTT Error:', err);
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>MQTT WebSocket Client Initialized</Text>
    </View>
  );
};

export default Mqtt;
