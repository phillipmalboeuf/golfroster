import React, { useContext } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'

import { Text, View } from 'react-native'
import { Button, Appbar, List, Headline, Caption } from 'react-native-paper'

import { Center, Padded, Spaced } from '../components/layouts'
import { Avatar, Background } from '../components/photos'


export const Player: FunctionComponent<{
  player
}> = ({ player }) => {

  return <>
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
          <Caption style={{ color: 'white' }}>Newton, MA</Caption>
        </View>
      </View>
    </Background>
      
    <Padded>
      <Text>Hi {player.first_name}</Text>
    </Padded>
  </>
}
