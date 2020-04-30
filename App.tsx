import React, { useState, useEffect, useContext } from 'react'
import { View, Text } from 'react-native'
import { DefaultTheme, Provider as PaperProvider, Colors, Theme, Headline, Portal } from 'react-native-paper'
import { Observer } from 'mobx-react'
import 'mobx-react-lite/batchingForReactNative'
import { NativeRouter } from 'react-router-native'

import firestore from '@react-native-firebase/firestore'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'

import { FirebaseContext } from './contexts/firebase'
import { StoreContext } from './contexts/store'
import { StylesContext } from './contexts/styles'

import { GetStarted } from './components/getstarted'
import { PlayerForm } from './components/player_form'

import { Navigation } from './components/navigation'
import { Center } from './components/layouts'
import { Title } from './components/text'
import { players } from './helpers/generators'


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

    // players()

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
