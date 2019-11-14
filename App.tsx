import React, { useState, useEffect, useContext } from 'react'
import { View, Text } from 'react-native'
import { DefaultTheme, Provider as PaperProvider, Colors, Theme, Headline } from 'react-native-paper'
import { Observer } from 'mobx-react'
import { NativeRouter } from 'react-router-native'

import firebase, { User } from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

import app from './clients/firebase'

import { FirebaseContext } from './contexts/firebase'
import { StoreContext } from './contexts/store'

import { GetStarted } from './routes/getstarted'
import { ProfileBuildup } from './routes/profile_buildup'

import { Navigation } from './components/navigation'
import { Center } from './components/layouts'


const db = app.firestore()
const auth = app.auth()
const storage = app.storage()

const theme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    text: '#0F0F0F',
    primary: '#007251',
    accent: '#FEF200',
    error: '#CF0F42',
    surface: '#F5F5F5',
  },
}


const App = () => {
  const [user, setUser] = useState<User>(undefined)
  const { store } = useContext(StoreContext)

  useEffect(() => {

    auth.onAuthStateChanged(async u => {
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
    <FirebaseContext.Provider value={{ db, auth, user, storage }}>
      {user === undefined
        ? <Center><Headline>One moment...</Headline></Center>
        : user !== null
          ? <Observer>{() => store.player.accepted_terms
            ? <NativeRouter><Navigation /></NativeRouter>
            : <View>
              <ProfileBuildup />
            </View>
          }</Observer>
          : <View>
            <GetStarted />
          </View>}
    </FirebaseContext.Provider>
  </PaperProvider>
}

export default App
