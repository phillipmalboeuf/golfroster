import React, { useContext, useState } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'

import { Text, View } from 'react-native'
import { Button, Appbar, List, Headline, Caption, Menu } from 'react-native-paper'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'

import { Center, Padded, Spaced } from '../components/layouts'
import { Avatar, Background } from '../components/photos'
import { Player } from '../components/player'


export const Profile: FunctionComponent<{}> = props => {
  const { user, auth } = useContext(FirebaseContext)
  const { store: { player } } = useContext(StoreContext)
  const [visible, setVisible] = useState(false)

  return <>
    <Appbar.Header>
      <Appbar.Content title='Your Player Profile' />
      <Appbar.Action icon='account-edit' />
      <Appbar.Action icon='settings' />
      <Menu
        contentStyle={{ backgroundColor: 'white' }}
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={<Appbar.Action icon='dots-vertical' onPress={() => setVisible(true)} />}>
        <Menu.Item onPress={() => auth.signOut()} title='Logout' />
      </Menu>
    </Appbar.Header>
    <Observer>{() => <>
      <Player player={player} />
    </>}</Observer>
  </>
}
