import React, { useEffect, useState, useRef } from 'react';
import { Platform, Alert, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

export default function App() {
  const webviewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Request notification permissions on iOS, auto granted on Android
    async function requestUserPermission() {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        console.log('Authorization status:', authStatus);
        getFcmToken();
      } else {
        Alert.alert('Notification permission denied');
      }
    }

    async function getFcmToken() {
      try {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        // You may want to send this token to your server for push notification targeting
      } catch (error) {
        console.log('Failed to get FCM token', error);
      }
    }

    requestUserPermission();

    // Foreground message handler
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('FCM Message received in foreground: ', remoteMessage);
      // Display notification
      displayNotification(remoteMessage);
    });

    // Background and quit state handling is done in native code (see firebase messaging docs)

    return unsubscribe;
  }, []);

  async function displayNotification(remoteMessage) {
    // Create a channel (Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    // Display notification
    await notifee.displayNotification({
      title: remoteMessage.notification?.title ?? 'Notification',
      body: remoteMessage.notification?.body ?? '',
      android: {
        channelId,
        smallIcon: 'ic_launcher', // use valid icon resource name
      },
    });
  }

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#6200ee"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginLeft: -25,
            marginTop: -25,
            zIndex: 10,
          }}
        />
      )}
      <WebView
        ref={webviewRef}
        source={{ uri: 'http://10.0.2.2:3000' }} // Use your Next.js dev server IP or deployed URL here
        onLoadEnd={() => setLoading(false)}
        startInLoadingState={true}
      />
    </View>
  );
}

