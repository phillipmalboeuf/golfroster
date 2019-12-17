import React, { useContext, useState } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'

import { Text, View } from 'react-native'
import { Button, Appbar, List, Headline, Caption, Menu } from 'react-native-paper'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'

import { Center, Padded, Spaced, Full } from '../components/layouts'
import { Avatar, Background } from '../components/photos'
import { Player } from '../components/player'
import { PlayerForm } from '../components/player_form'


export const Profile: FunctionComponent<{}> = props => {
  const { user, auth } = useContext(FirebaseContext)
  const { store: { player, logout } } = useContext(StoreContext)

  const [editing, setEditing] = useState(false)
  const [visible, setVisible] = useState(false)

  return <>
    <Appbar.Header>
      <Appbar.Content title='Your Player Profile' />
      <Appbar.Action icon='account-edit' onPress={() => setEditing(true)} />
      <Appbar.Action icon='settings' />
      <Menu
        contentStyle={{ backgroundColor: 'white' }}
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={<Appbar.Action icon='dots-vertical' onPress={() => setVisible(true)} />}>
        <Menu.Item onPress={() => logout()} title='Logout' />
      </Menu>
    </Appbar.Header>
    
    <Player player={player} />

    {editing && <Full><PlayerForm onSubmit={() => setEditing(false)} onCancel={() => setEditing(false)} /></Full>}
  </>
}
