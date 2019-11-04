import React, { useContext } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'

import { Text, View } from 'react-native'
import { Button, Appbar, List, Headline, Caption } from 'react-native-paper'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'

import { Center, Padded, Spaced } from '../components/layouts'
import { Avatar, Background } from '../components/photos'
import { Player } from '../components/player'


export const Profile: FunctionComponent<{}> = props => {
  const { user, auth } = useContext(FirebaseContext)
  const { store } = useContext(StoreContext)
  const { player } = store

  return <>
    <Appbar.Header>
      <Appbar.Content title='Your Player Profile' />
      <Appbar.Action icon='account-edit' />
      <Appbar.Action icon='settings' />
      <Appbar.Action icon='dots-vertical' />
    </Appbar.Header>
    <Observer>{() => <>
      <Player player={player} />
      <Button onPress={() => auth.signOut()}>Logout</Button>
    </>}</Observer>
  </>
}
