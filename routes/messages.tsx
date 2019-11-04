import React, { useContext, Fragment } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'

import { Text } from 'react-native'
import { NativeRouter, Switch, Route, Link } from 'react-router-native'
import { Button, Appbar, List } from 'react-native-paper'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'

import { Avatar } from '../components/photos'
import { Chatroom } from '../components/chatroom'


export const Messages: FunctionComponent<{}> = props => {
  const { store } = useContext(StoreContext)

  return <Observer>
  {() => <NativeRouter>
    <Switch>
      <Route exact path='/chatrooms/:id' render={({ match }) => {
        const chatroom = store.chatrooms.get(match.params.id)
        return <Fragment key={match.params.id}>
          <Appbar.Header dark={false} style={{ backgroundColor: 'white' }}>
            <Link to='/'><Appbar.BackAction /></Link>
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
              <List.Item title={`${chatroom.players}`} />
            </Link>)}
        </List.Section>}</Observer>
      </>} />
    </Switch>
  </NativeRouter>}
  </Observer>
}
