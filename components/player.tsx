import React, { useContext } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'

import { Text, View } from 'react-native'
import { Appbar, List, Headline, Caption } from 'react-native-paper'

import { StoreContext } from '../contexts/store'
import { Player as PlayerModel } from '../models/player'

import { Center, Padded, Spaced } from '../components/layouts'
import { Avatar, Background } from '../components/photos'
import { Button } from '../components/button'


export const Player: FunctionComponent<{
  player: Instance<typeof PlayerModel>
}> = ({ player }) => {
  const { store } = useContext(StoreContext)
  return <Observer>
  {() => <>
    <Background photo={player.photo}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <Padded>
          <Avatar {...player} />
        </Padded>
        <View>
          <Headline style={{ color: 'white', marginBottom: 0 }}>
            {player.first_name} {player.last_name}
          </Headline>
          <Caption style={{ color: 'white' }}>{player.city}, {player.state}</Caption>
          {player.id !== store.player.id && (store.player.friends.includes(player.id)
            ? player.friends.includes(store.player.id)
              ? <Button outlined
                  onPress={() => store.player.unfriend(player.id)}>Unfriend</Button>
              : <Button outlined disabled>Friend Request Sent</Button>
            : player.friends.includes(store.player.id)
              ? <Button outlined
                  onPress={() => store.player.requestFriend(player.id)}>Respond to Friend Request</Button>
              : <Button outlined
                  onPress={() => store.player.requestFriend(player.id)}>Send a Friend Request</Button>)}
        </View>
      </View>
    </Background>
      
    <Padded>
      <Text>{player.bio}</Text>
    </Padded>
  </>}</Observer>
}
