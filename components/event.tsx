import React, { useContext } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'

import { Text, View } from 'react-native'
import { Button, Appbar, List, Headline, Caption } from 'react-native-paper'

import { StoreContext } from '../contexts/store'
import { Event as EventModel } from '../models/event'

import { Center, Padded, Spaced } from '../components/layouts'
import { Avatar, Background } from '../components/photos'



export const Event: FunctionComponent<{
  event: Instance<typeof EventModel>
}> = ({ event }) => {
  const { store } = useContext(StoreContext)
  return <Observer>
  {() => <>
    <Background photo={event.photo}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <Padded>
          <View>
            <Headline style={{ color: 'white', marginBottom: 0 }}>
              {event.name}
            </Headline>
          </View>
        </Padded>
        
      </View>
    </Background>
      
    <Padded>
      <Text>{event.description}</Text>
      <Text>{JSON.stringify(event.attendees)}</Text>
    </Padded>
  </>}</Observer>
}
