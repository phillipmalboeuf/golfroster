import React, { useState, useEffect, useContext } from 'react'
import { View } from 'react-native'
import { DefaultTheme, Provider as PaperProvider, Colors, Theme } from 'react-native-paper'
import { Appbar } from 'react-native-paper'

import firebase, { User } from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

import { FirebaseContext } from './contexts/firebase'
import { Profile } from './routes/profile'
import { Login } from './routes/login'
import { StoreContext } from './contexts/store'


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
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.green500,
    accent: Colors.blue500,
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


    store.login('O9MfbO7egDQIn6KmDHyA')

    auth.onAuthStateChanged(u => setUser(u))
  }, [])
  
  return <PaperProvider theme={theme}>
    <FirebaseContext.Provider value={{ db, auth, user }}>
      <Appbar.Header>
        <Appbar.Content
          title='GolfRoster'
        />
      </Appbar.Header>
      <View>
        {/* {players.map(player => <Text key={player.id}>{JSON.stringify(player)}</Text>)} */}

        {user
          ? <Profile />
          : <Login />}
      </View>
    </FirebaseContext.Provider>
  </PaperProvider>
}

export default App
