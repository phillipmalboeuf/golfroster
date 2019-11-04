import React, { useContext, Fragment } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'

import { Text } from 'react-native'
import { NativeRouter, Switch, Route, Link } from 'react-router-native'
import { Button, Appbar, List } from 'react-native-paper'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'

import { Avatar } from '../components/photos'
import { Player } from '../components/player'


export const Players: FunctionComponent<{}> = props => {
  const { user, auth } = useContext(FirebaseContext)
  const { store } = useContext(StoreContext)

  return <NativeRouter>
    <Switch>
      <Route exact path='/players/:id' render={({ match }) => {
        const player = store.friends.get(match.params.id)
        return <Fragment key={match.params.id}>
          <Appbar.Header dark={false} style={{ backgroundColor: 'white' }}>
            <Link to='/'><Appbar.BackAction /></Link>
            <Appbar.Content title={`${player.first_name}'s Profile`} />
            <Appbar.Action icon='account-plus' />
            <Appbar.Action icon='message-outline' />
            <Appbar.Action icon='dots-vertical' />
          </Appbar.Header>
          <Player player={player} />
        </Fragment>
      }} />
      <Route exact render={() => <>
        <Appbar.Header>
          <Appbar.Content title='Players' />
          <Appbar.Action icon='magnify' />
          <Appbar.Action icon='dots-vertical' />
        </Appbar.Header>
        <Observer>{() => <List.Section>
          {Array.from(store.friends.values()).map(friend => <Link key={friend.id} to={`/players/${friend.id}`}>
            <List.Item title={`${friend.first_name} ${friend.last_name}`}
              left={() => <Avatar {...friend} small />} />
          </Link>)}
        </List.Section>}</Observer>
      </>} />
    </Switch>
  </NativeRouter>
}
