import React, { useContext, Fragment, useRef, useState } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'

import { Text } from 'react-native'
import { NativeRouter, Switch, Route, Link, useHistory } from 'react-router-native'
import { Button, Appbar, List } from 'react-native-paper'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'

import { Chatroom } from '../models/chatroom'

import { Avatar } from '../components/photos'
import { Player } from '../components/player'
import { Group } from '../components/group'
import { Search } from '../components/search'
import { NewGroup } from '../components/new_group'


export const Players: FunctionComponent<{}> = props => {
  const { store } = useContext(StoreContext)
  const history = useHistory()

  return <Switch>
    <Route exact path='/players/:id' render={({ match }) => {
      const player = store.friends.get(match.params.id)
      return <Fragment key={match.params.id}>
        <Appbar.Header dark={false} style={{ backgroundColor: 'white' }}>
          <Link to='/players'><Appbar.BackAction /></Link>
          <Appbar.Content title={`${player.first_name}'s Profile`} />
          <Appbar.Action icon='account-plus' />
          <Appbar.Action icon='message-outline' onPress={async () => {
            const chatroom = Array.from(store.chatrooms.values()).find(room =>
              !room.event_id && !room.group_id
              && room.players.includes(match.params.id))

            if (chatroom) {
              // console.log(chatroom)
              history.push(`/chatrooms/${chatroom.id}`)
            } else {
              await store.createChatroom({
                players: [match.params.id],
              }).then(room => {
                history.push(`/chatrooms/${(room as any as Instance<typeof Chatroom>).id}`)
              })
            }
          }} />
          <Appbar.Action icon='dots-vertical' />
        </Appbar.Header>
        <Player player={player} />
      </Fragment>
    }} />
    <Route exact path='/groups/:id' render={({ match }) => {
      const group = store.groups.get(match.params.id)
      return <Fragment key={match.params.id}>
        <Appbar.Header dark={false} style={{ backgroundColor: 'white' }}>
          <Link to='/groups'><Appbar.BackAction /></Link>
          <Appbar.Content title={group.name} />
          <Appbar.Action icon='message-outline' />
          <Appbar.Action icon='dots-vertical' />
        </Appbar.Header>
        <Group group={group} />
      </Fragment>
    }} />
    <Route exact render={() => <>
      <Appbar.Header>
        <Appbar.Content title='Friends & Groups' />
        <Appbar.Action icon='magnify' />
        <Appbar.Action icon='dots-vertical' />
      </Appbar.Header>
      
      <Search index='players' />

      <Observer>{() => <List.Section>
        {Array.from(store.friends.values()).map(friend => <Link key={friend.id} to={`/players/${friend.id}`}>
          <List.Item title={`${friend.first_name} ${friend.last_name}`}
            left={() => <Avatar {...friend} small />} />
        </Link>)}
        {Array.from(store.groups.values()).map(group => <Link key={group.id} to={`/groups/${group.id}`}>
          <List.Item title={group.name} />
        </Link>)}
      </List.Section>}</Observer>

      <NewGroup />
    </>} />
  </Switch>
}
