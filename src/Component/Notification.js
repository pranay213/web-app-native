import { View, Text, Alert } from "react-native";
import React, { useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid } from "react-native";
import notifee, { EventType } from "@notifee/react-native";
import { savetoken } from "../api";

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

const Notification = ({ navigation, setSiteUrl }) => {
  useEffect(() => {
    requestUserPermission();
  }, []);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
      messaging()
        .getToken()
        .then(async(token) => {
          console.log("tokens:", token);
          let tokenSave=await savetoken(token)
          console.log("----Resp",tokenSave)
        });
    }
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("Ms-----------g\n", remoteMessage);
      if (remoteMessage.data?.route) {
        setSiteUrl((prev) => remoteMessage.data?.route);
      }
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      onDisplayNotification(remoteMessage);
    });
    return unsubscribe;
  }

  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log("User dismissed notification", detail.notification);
          break;
        case EventType.PRESS:
          if (detail.notification.data?.route) {
            setSiteUrl((prev) => detail.notification.data?.route);
          }
          break;
      }
    });
  }, []);

  async function onDisplayNotification(message) {
    const { data, notification } = message;
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });

    // Display a notification
    await notifee.displayNotification({
      title: notification.title,
      body: notification.body,
      data,
      android: {
        channelId,
        pressAction: {
          id: "default",
        },
      },
    });
  }

  return <></>;
};

export default Notification;
