import React, { useState, useEffect, useContext } from 'react'
import { View, Text } from 'react-native'
import { DefaultTheme, Provider as PaperProvider, Colors, Theme, Headline } from 'react-native-paper'
import { Appbar } from 'react-native-paper'

import firebase, { User } from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

import { FirebaseContext } from './contexts/firebase'
import { StoreContext } from './contexts/store'

import { Profile } from './routes/profile'
import { GetStarted } from './routes/getstarted'
import { ProfileBuildup } from './routes/profile_buildup'

import { Navigation } from './components/navigation'
import { Center } from './components/layouts'
import { Observer } from 'mobx-react'


const app = firebase.initializeApp({
  apiKey: 'AIzaSyBE9N72hl6q78zTBVUZVCwYplZ9iDOG8e8',
  authDomain: 'golfroster.firebaseapp.com',
  projectId: 'golfroster',
  databaseURL: 'https://golfroster.firebaseio.com',
  storageBucket: 'golfroster.appspot.com',
})

const db = app.firestore()
const auth = app.auth()

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
  // const [players, setPlayers] = useState([])
  const [user, setUser] = useState<User>(undefined)
  const { store } = useContext(StoreContext)

  useEffect(() => {
    // db.collection('players').where('club', '==', 'Fairway').onSnapshot(snapshot => {
    //   setPlayers(snapshot.docs.map(doc => ({
    //     ...doc.data(),
    //     id: doc.id,
    //   })))
    // })


    // store.login('O9MfbO7egDQIn6KmDHyA')

    auth.onAuthStateChanged(async u => {
      if (u) {
        await store.login(u.uid)
        store.listEvents()
      }
      // console.log(store.player)
      setUser(u)
    })
  }, [])
  
  return <PaperProvider theme={theme}>
    <FirebaseContext.Provider value={{ db, auth, user }}>
      {/* <Appbar.Header>
        <Appbar.Content
          title='GolfRoster'
        />
      </Appbar.Header> */}
      {user === undefined
        ? <Center><Headline>One moment...</Headline></Center>
        : user !== null
          ? <Observer>{() => store.player.accepted_terms
            ? <Navigation />
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
