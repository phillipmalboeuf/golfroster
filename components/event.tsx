import React, { useContext } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'

import { Text, View, ScrollView } from 'react-native'
import { Button, Appbar, List, Headline, Caption, Surface } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment'

import { StoreContext } from '../contexts/store'
import { StylesContext } from '../contexts/styles'
import { Event as EventModel } from '../models/event'

import { Center, Padded, Spaced } from './layouts'
import { Avatar, Background } from './photos'
import { Subheader } from './text'
import { Row } from './player'
import { teeChoices, methods, money, drinks } from './new_player'



export const Event: FunctionComponent<{
  event: Instance<typeof EventModel>
}> = ({ event }) => {
  const { colors, sizes } = useContext(StylesContext)
  return <ScrollView>
    <Observer>{() => <>
      <Background photo={event.photo}>
        <Padded>
          <View style={{
            minHeight: 166,
            justifyContent: 'center',
          }}>
            <Headline style={{ color: 'white', marginBottom: 0, textAlign: 'center' }}>
              {event.name}
            </Headline>
            <Caption style={{ color: 'white', textAlign: 'center' }}>
              {moment(event.start_date).format('dddd MMMM Do hh:mma')}
            </Caption>
          </View>
        </Padded>
      </Background>
      <Surface style={{ backgroundColor: 'black', padding: 6 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>
          {moment(event.start_date).fromNow()}
        </Text>
      </Surface>
        
      <Padded tight>
        <View style={{ flexDirection: 'row' }}>
          <Icon style={{ marginRight: sizes.base / 2 }}
            name='format-quote-open' size={sizes.big} />
          <Text style={{ flex: 1, fontSize: sizes.base, lineHeight: sizes.base * 1.33 }}>{event.description}</Text>
        </View>
      </Padded>
      <Padded tight>
        <Subheader>Attendees</Subheader>
        <Text>{JSON.stringify(event.attendees)}</Text>
      </Padded>

      <Padded tight>
        <Subheader>Club Location</Subheader>
        <Text>{event.club}</Text>
      </Padded>

      <Padded tight>
        {/* <Row boldItems title='GHIN Index'
          items={event.ghin_index && [event.ghin_index]} /> */}
        
        <Row title='Tee Choices'
          items={event.tee_choices}
          labels={teeChoices} />
        <Row title='Methods of Play'
          items={event.methods}
          labels={methods} />
        <Row title='Play for Money'
          items={event.money}
          labels={money} />
        <Row title='Drink on the course'
          items={event.drinks}
          labels={drinks} />
      </Padded>
    </>}</Observer>
  </ScrollView>
}
