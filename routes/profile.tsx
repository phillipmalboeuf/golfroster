import React, { useContext } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'

import { Text } from 'react-native'
import { Button, Appbar } from 'react-native-paper'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'
import { Center, Padded } from '../components/layouts'


export const Profile: FunctionComponent<{}> = props => {
  const { user, auth } = useContext(FirebaseContext)
  const { store } = useContext(StoreContext)

  return <>
    <Appbar.Header>
      <Appbar.Content title='Your Player Profile' />
      <Appbar.Action icon='account-edit' />
      <Appbar.Action icon='settings' />
      <Appbar.Action icon='dots-vertical' />
    </Appbar.Header>
    <Padded>
      <Observer>{() => <Text>Hi {user.email} {store.player.id} {store.player.first_name}</Text>}</Observer>
      <Button onPress={() => auth.signOut()}>Logout</Button>
    </Padded>
  </>
}
