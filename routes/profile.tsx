import React, { useContext } from 'react'
import { FunctionComponent } from 'react'

import { Text } from 'react-native'
import { Button } from 'react-native-paper'

import { FirebaseContext } from '../contexts/firebase'


export const Profile: FunctionComponent<{}> = props => {
  const { user, auth } = useContext(FirebaseContext)

  return <>
    <Text>Hi {user.email}</Text>
    <Button onPress={e => auth.signOut()}>Logout</Button>
  </>
}
