import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { DefaultTheme, Provider as PaperProvider, Button, Colors, Theme } from 'react-native-paper'
import { Appbar } from 'react-native-paper'

import firebase, { User } from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

import { Form } from './components/form'
import { Input } from './components/input'

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

export default function App() {
  const [players, setPlayers] = useState([])
  const [user, setUser] = useState<User>(undefined)

  useEffect(() => {
    db.collection('players').where('club', '==', 'Fairway').onSnapshot(snapshot => {
      setPlayers(snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })))
    })

    auth.onAuthStateChanged(u => setUser(u))
  }, [])
  
  return <PaperProvider theme={theme}>
    <Appbar.Header>
      <Appbar.Content
        title='GolfRoster'
      />
    </Appbar.Header>
    <View>
      {players.map(player => <Text key={player.id}>{JSON.stringify(player)}</Text>)}
      {user
        ? <>
          <Text>Hi {user.email}</Text>
          <Button onPress={e => auth.signOut()}>Logout</Button>
        </>
        : <Form onSubmit={async ({ email, password }) => {
          auth.signInWithEmailAndPassword(email, password)
        }} cta='login'>
          <Input name='email' type='email' label='Email address' placeholder='player@golfroster.com' />
          <Input name='password' type='password' label='Password' placeholder='********' />
        </Form>}
    </View>
  </PaperProvider>
}
