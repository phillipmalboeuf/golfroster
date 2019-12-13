import React, { useContext, Fragment, useRef, useState, useEffect } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'

import { Text, ScrollView } from 'react-native'
import { NativeRouter, Switch, Route, Link, useHistory } from 'react-router-native'
import { Appbar, Banner, Headline, Card, Paragraph, Colors } from 'react-native-paper'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'
import { StylesContext } from '../contexts/styles'
import { usePlayer } from '../helpers/hooks'

import { Chatroom } from '../models/chatroom'

import { Avatar } from '../components/photos'
import { Player } from '../components/player'
import { Group } from '../components/group'
import { Search } from '../components/search'
import { NewGroup } from '../components/new_group'
import { List } from '../components/list'
import { Button } from '../components/button'


const PlayerRoute: FunctionComponent<{
  id: string
}> = ({ id }) => {
  const { store } = useContext(StoreContext)
  const history = useHistory()

  const player = usePlayer(id)

  return player ? <>
    <Appbar.Header dark={false} style={{ backgroundColor: 'white' }}>
      <Link to='/players'><Appbar.BackAction /></Link>
      <Appbar.Content title={`${player.first_name}'s Profile`} />
      <Appbar.Action icon='account-plus' />
      <Appbar.Action icon='message-outline' onPress={async () => {
        const chatroom = Array.from(store.chatrooms.values()).find(room =>
          !room.event_id && !room.group_id
          && room.players.includes(id))

        if (chatroom) {
          // console.log(chatroom)
          history.push(`/chatrooms/${chatroom.id}`)
        } else {
          await store.createChatroom({
            players: [id],
          }).then(room => {
            history.push(`/chatrooms/${(room as any as Instance<typeof Chatroom>).id}`)
          })
        }
      }} />
      <Appbar.Action icon='dots-vertical' />
    </Appbar.Header>
    <Player player={player} />
  </> : null
}


export const Players: FunctionComponent<{}> = props => {
  const { store } = useContext(StoreContext)

  const [searching, setSearching] = useState(false)

  return <Switch>
    <Route exact path='/players/:id' render={({ match }) => {
      return <PlayerRoute key={match.params.id} id={match.params.id} />
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
        <Appbar.Action icon='magnify' onPress={() => setSearching(true)} />
        <Appbar.Action icon='dots-vertical' />
      </Appbar.Header>
      
      <Search visible={searching} onDismiss={() => setSearching(false)} index='players' />

      <ScrollView>
        <LookingForPlayers onPress={() => setSearching(true)} />
        <Observer>{() => <List sections={[{
          items: [
            ...Array.from(store.friends.values()).map(friend => ({
              title: `${friend.first_name} ${friend.last_name}`,
              link: `/players/${friend.id}`,
              left: <Avatar {...friend} small />,
            })),
            ...Array.from(store.groups.values()).map(group => ({
              title: group.name,
              link: `/groups/${group.id}`,
            })),
          ],
        }]} />}</Observer>
      </ScrollView>

      <NewGroup />
    </>} />
  </Switch>
}

const LookingForPlayers: FunctionComponent<{
  onPress?: () => void
}> = props => {
  const [visible, setVisible] = useState(true)
  const { sizes, colors } = useContext(StylesContext)
  const { store } = useContext(StoreContext)

  return (store.lookingForPlayers && visible)
    ? <Card style={{ backgroundColor: colors.faded, paddingTop: sizes.base, shadowOpacity: 0 }}>
      <Card.Title titleStyle={{
        fontSize: sizes.big,
        lineHeight: sizes.big * 1.5,
        fontWeight: 'normal',
      }} title='Looking for new Players?' />
      <Card.Content style={{ paddingHorizontal: sizes.base, marginBottom: sizes.base }}>
        <Paragraph>
          With our search functions, you may find players nearby with similar interests or close GHIN index.
        </Paragraph>
      </Card.Content>
      <Card.Actions style={{
        justifyContent: 'space-between',
        paddingHorizontal: sizes.base,
        paddingVertical: sizes.base / 2,
        borderTopColor: colors.greys[0],
        borderTopWidth: 1,
      }}>
        <Button contained black pill icon='magnify' onPress={props.onPress}>Search Players</Button>
        <Button onPress={() => {
          store.stopLookingForPlayers()
          setVisible(false)
        }}>Close</Button>
      </Card.Actions>
    </Card>
    : null
}
