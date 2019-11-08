import React, { useContext, Fragment, useRef } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'

import { Text } from 'react-native'
import { NativeRouter, Switch, Route, Link } from 'react-router-native'
import { Button, Appbar, List, Caption } from 'react-native-paper'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'

import { Avatar } from '../components/photos'
import { Chatroom } from '../components/chatroom'
import moment from 'moment'


export const Chatrooms: FunctionComponent<{}> = props => {
  const { store } = useContext(StoreContext)

  return <Observer>
  {() => <>
    <Switch>
      <Route exact path='/chatrooms/:id' render={({ match }) => {
        const chatroom = store.chatrooms.get(match.params.id)
        return <Fragment key={match.params.id}>
          <Appbar.Header dark={false} style={{ backgroundColor: 'white' }}>
            <Link to='/chatrooms'><Appbar.BackAction /></Link>
            <Appbar.Content title={`Chatroom`} />
            <Appbar.Action icon='dots-vertical' />
          </Appbar.Header>
          <Chatroom chatroom={chatroom} />
        </Fragment>
      }} />
      <Route exact render={() => <>
        <Appbar.Header>
          <Appbar.Content title='Message Threads' />
          <Appbar.Action icon='magnify' />
          <Appbar.Action icon='dots-vertical' />
        </Appbar.Header>
        <Observer>{() => <List.Section>
          {Array.from(store.chatrooms.values()).map(chatroom =>
            <Link key={chatroom.id} to={`/chatrooms/${chatroom.id}`}>
              <List.Item title={chatroom.players.filter(playerId => playerId !== store.player.id)
                .map(player => `${store.friends.get(player).first_name} ${store.friends.get(player).last_name}`)
                .join(', ')}
                description={chatroom.latest
                  ? (chatroom.latest.player_id === store.player.id
                    ? `You: ${chatroom.latest.body}`
                    : `${store.friends.get(chatroom.latest.player_id).first_name}: ${chatroom.latest.body}`)
                  : 'New conversation'}
                right={() => <Caption>{chatroom.latest ? moment(chatroom.latest.date).fromNow() : 'New'}</Caption>}
              />
            </Link>)}
        </List.Section>}</Observer>
      </>} />
    </Switch>
  </>}
  </Observer>
}
