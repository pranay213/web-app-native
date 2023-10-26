import React, { createContext, useState, useEffect } from "react";
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native';
import notifee from '@notifee/react-native';


const MainContext = createContext({});


const MainContextProvider = ({ children }) => {
    const [deviceToken,setDeviceToken]=useState(null)
    useEffect(() => {
        // PermissionsAndroid.request(
        //   PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        // );
        if (requestUserPermission()) {
          messaging()
            .getToken()
            .then((token) => {
              console.log("New Token", token);
           
            });
        } else {
          console.log("failed to get token", authStatus);
        }
        messaging()
          .getInitialNotification()
          .then((remoteMessage) => {
            if (remoteMessage) {
              console.log("-----", remoteMessage);
              console.log(
                "Notification caused app to open from quit state:",
                remoteMessage.notification
              );
            }
          });
    
        messaging().onNotificationOpenedApp(onDisplayNotification);
    
        // messaging().onNotificationOpenedApp(async (remoteMessage) => {
        //   console.log("-----", remoteMessage);
        //   console.log(
        //     "Notification caused app to open from background state:",
        //     remoteMessage.notification
        //   );
        // });
        // Register background handler
    
        // messaging().setBackgroundMessageHandler(onMessageReceived);
    
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
          console.log("Message handled in the background!", remoteMessage);
        });
    
        const unsubscribe = messaging().onMessage(onDisplayNotification);
        // const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        //   console.log("-----", remoteMessage);
        //   // await messaging().setBackgroundMessageHandler();
        //   // Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
        //   // alert();
        //   // onDisplayNotification(notification);
        // });
    
        return unsubscribe;
      }, []);
    
      async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
        if (enabled) {
          console.log("Authorization status:", authStatus);
        }
      }
        

        //notifee notification

        async function onDisplayNotification(data) {
            // Request permissions (required for iOS)
            await notifee.requestPermission()

            // Create a channel (required for Android)
            const channelId = await notifee.createChannel({
                id: 'default',
                name: 'Default Channel',
            });

            // Display a notification
            await notifee.displayNotification({
                title: 'Notification Title',
                body: 'Main body content of the notification',
                android: {
                    channelId,
                    // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
                    // pressAction is needed if you want the notification to open the app when pressed
                    pressAction: {
                        id: 'default',
                    },
                },
            });
        }

        return <MainContext.Provider
            value={{
                deviceToken,setDeviceToken
            }}
        >
            {children}
        </MainContext.Provider>
    }



    export { MainContext, MainContextProvider }