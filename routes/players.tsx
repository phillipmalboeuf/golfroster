import React, { useContext } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'

import { Text } from 'react-native'
import { Button, Appbar, List } from 'react-native-paper'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'
import { Player } from '../models/player'
import { Avatar } from '../components/photos'


export const Players: FunctionComponent<{}> = props => {
  const { user, auth } = useContext(FirebaseContext)
  const { store } = useContext(StoreContext)


  return <>
    <Appbar.Header>
      <Appbar.Content title='Players' />
      <Appbar.Action icon='magnify' />
      <Appbar.Action icon='dots-vertical' />
    </Appbar.Header>
    <Observer>{() => <List.Section>
      {Array.from(store.friends.values()).map(friend => 
        <List.Item title={`${friend.first_name} ${friend.last_name}`}
          left={() => <Avatar {...friend} small />} />)}
    </List.Section>}</Observer>
  </>
}
