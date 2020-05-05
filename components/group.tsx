import React, { useContext } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'

import { Text, View, ScrollView } from 'react-native'
import { Button, Appbar, Headline, Caption, Surface } from 'react-native-paper'

import { StoreContext } from '../contexts/store'
import { Group as GroupModel } from '../models/group'

import { Center, Padded, Spaced } from './layouts'
import { Avatar, Background } from './photos'
import { Row } from './player'
import { teeChoices, methods, money, drinks } from './player_form'
import { Quote } from './text'
import { Members } from './members_list'



export const Group: FunctionComponent<{
  group: Instance<typeof GroupModel>
}> = ({ group }) => {
  const { store } = useContext(StoreContext)
  return <ScrollView>
    <Observer>
    {() => <>
      <Background photo={group.photo}>
        <Padded>
          <View style={{
            minHeight: 166,
            justifyContent: 'center',
          }}>
            <Headline style={{ color: 'white', marginBottom: 0, textAlign: 'center' }}>
              {group.name}
            </Headline>
            <Caption style={{ color: 'white', textAlign: 'center' }}>
              {group.city}, {group.state}
            </Caption>
          </View>
        </Padded>
      </Background>
      <Surface style={{ backgroundColor: 'black', padding: 6 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>
          {group.is_public ? 'Public' : 'Private'} Group
        </Text>
      </Surface>

      {group.description && <Quote>{group.description}</Quote>}
      
      <Members label='Members' ids={group.members} organizer={group.organizer_id} group={group} />

      <Padded tight>
          {/* <Row boldItems title='GHIN Index'
            items={event.ghin_index && [event.ghin_index]} /> */}
        
        <Row title='Tee Choices'
          items={group.tee_choices}
          labels={teeChoices} />
        <Row title='Methods of Play'
          items={group.methods}
          labels={methods} />
        <Row title='Play for Money'
          items={group.money}
          labels={money} />
        <Row title='Drink on the course'
          items={group.drinks}
          labels={drinks} />
      </Padded>
    </>}</Observer>
  </ScrollView>
}
