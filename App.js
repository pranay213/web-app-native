import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, SafeAreaView, View } from 'react-native';
import WebView from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import Notification from './src/Component/Notification';


export default function App({navigation}) {

  const [siteUrl,setSiteUrl]=useState('https://www.mobilemasala.com')

  const webView = useRef(null);
  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', HandleBackPressed);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', HandleBackPressed);
      }
    }
  }, []);

  const HandleBackPressed = () => {
    if (webView.current) {
      webView.current.goBack();
      return true;
    }
    return false;
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <StatusBar translucent={false} barStyle="light-content" backgroundColor='rgba(0, 0, 0, 0)' style="Dark" />
        <WebView ref={webView} source={{ uri: siteUrl }} style={{ flex: 1 }} />
        <Notification navigation={navigation} setSiteUrl={setSiteUrl}/>
      </View>
    </SafeAreaView>
  );
}

