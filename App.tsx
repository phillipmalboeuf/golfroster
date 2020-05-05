import React, { useState, useEffect, useContext } from 'react'
import { View, Text, Alert } from 'react-native'
import { DefaultTheme, Provider as PaperProvider, Colors, Theme, Headline, Portal } from 'react-native-paper'
import { Observer } from 'mobx-react'
import 'mobx-react-lite/batchingForReactNative'
import { NativeRouter } from 'react-router-native'

import firestore from '@react-native-firebase/firestore'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'
import messaging from '@react-native-firebase/messaging'

import { FirebaseContext } from './contexts/firebase'
import { StoreContext } from './contexts/store'
import { StylesContext } from './contexts/styles'

import { GetStarted } from './components/getstarted'
import { PlayerForm } from './components/player_form'

import { Navigation } from './components/navigation'
import { Center } from './components/layouts'
import { Title } from './components/text'
import { players } from './helpers/generators'


firestore().settings({ persistence: false })
firestore().enableNetwork()
messaging().requestPermission()

async function onMessageReceived(message) {
  // Alert.alert(JSON.stringify(message))
}

messaging().onMessage(onMessageReceived)
messaging().setBackgroundMessageHandler(onMessageReceived)


const App = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User>(undefined)
  const { store } = useContext(StoreContext)
  const { colors } = useContext(StylesContext)

  const theme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      text: colors.blacks[0],
      primary: colors.green,
      accent: colors.yellow,
      error: colors.red,
      surface: colors.greys[0],
    },
  }

  useEffect(() => {
    auth().onAuthStateChanged(async u => {
      if (u) {
        await store.login(u.uid)
        store.listEvents()
        store.listFriends()
        store.listGroups()
        store.listChatrooms()
        store.listNotifications()
      }

      setUser(u)
    })
  }, [])


  useEffect(() => {
    if (store.player) {
      
      messaging()
        .getToken()
        .then(async token => {
          return store.addToken(token)
        })

    // Check whether an initial notification is available
    // messaging()
    //   .getInitialNotification()
    //   .then(remoteMessage => {
    //     if (remoteMessage) {
    //       console.log(
    //         'Notification caused app to open from quit state:',
    //         remoteMessage.notification
    //       );
    //     }
    //   });

      return messaging().onTokenRefresh(token => {
        store.addToken(token)
      })
    }
  }, [store.player])
  
  
  return <PaperProvider theme={theme}>
    <FirebaseContext.Provider value={{ user }}>
      {user === undefined
        ? <Center><Title>One moment...</Title></Center>
        : <Observer>{() => (user !== null && store.player)
          ?  store.player.accepted_terms
            ? <NativeRouter><Portal.Host><Navigation /></Portal.Host></NativeRouter>
            : <View>
              <PlayerForm onSubmit={() => undefined} onCancel={() => auth().signOut()} />
            </View>
          : <View>
            <GetStarted />
          </View>}</Observer>}
    </FirebaseContext.Provider>
  </PaperProvider>
}

export default App
