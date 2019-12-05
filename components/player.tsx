import React, { useContext } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'

import { Text, View, ScrollView } from 'react-native'
import { Appbar, Headline, Caption } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { StoreContext } from '../contexts/store'
import { StylesContext } from '../contexts/styles'
import { Player as PlayerModel } from '../models/player'

import { Center, Padded } from './layouts'
import { Avatar, Background } from './photos'
import { Button } from './button'
import { Subheader, Italic, Bold } from './text'
import { List } from './list'
import { timesOfDay, teeChoices, methods, money, drinks } from './new_player'


export const Player: FunctionComponent<{
  player: Instance<typeof PlayerModel>
}> = ({ player }) => {
  const { store } = useContext(StoreContext)
  const { colors, sizes } = useContext(StylesContext)

  return <ScrollView>
    <Observer>
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
            <Caption style={{ color: 'white', fontSize: sizes.base }}>{player.city}, {player.state}</Caption>
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
        
      <Padded tight>
        <View style={{ flexDirection: 'row' }}>
          <Icon style={{ marginRight: sizes.base / 2 }}
            name='format-quote-open' size={sizes.big} />
          <Text style={{ flex: 1, fontSize: sizes.base, lineHeight: sizes.base * 1.33 }}>{player.bio}</Text>
        </View>
      </Padded>

      <Padded tight>
        <Subheader>{player.first_name}'s Clubs</Subheader>
        <List sections={[{
          items: player.clubs.map(club => ({
            title: club,
            link: `/clubs/${club}`,
          })),
        }]} />
      </Padded>

      <Padded tight>
        <Subheader>{player.first_name}'s Player Groups</Subheader>
        {/* <List sections={[{
          items: player.clubs.map(club => ({
            title: club,
            link: `/clubs/${club}`,
          })),
        }]} /> */}
      </Padded>

      <Padded tight>
        <Subheader>{player.first_name} prefers to play</Subheader>
        <Row italicTitle title='Weekends'
          items={player.weekends}
          labels={timesOfDay} />
        <Row italicTitle title='Weekdays'
          items={player.weekdays}
          labels={timesOfDay} />

        <Row boldItems title='GHIN Index'
          items={player.ghin_index && [player.ghin_index]} />
        
        <Row title='Tee Choices'
          items={player.tee_choices}
          labels={teeChoices} />
        <Row title='Methods of Play'
          items={player.methods}
          labels={methods} />
        <Row title='Play for Money'
          items={player.money}
          labels={money} />
        <Row title='Drink on the course'
          items={player.drinks}
          labels={drinks} />
      </Padded>
    </>}</Observer>
  </ScrollView>
}

export const Row: FunctionComponent<{
  italicTitle?: boolean
  boldItems?: boolean
  title: string
  items: Array<string | number>
  labels?: {[key: string]: string}
}> = ({ italicTitle, boldItems, title, items, labels }) => {
  return items && items.length ? <View style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  }}>
    {italicTitle ? <Italic>{title}</Italic> : <Bold>{title}</Bold>}
    <View>
      {items.map(item => boldItems
        ? <Bold key={item}>{(labels && labels[item]) || item}</Bold>
        : <Text key={item}>{(labels && labels[item]) || item}</Text>)}
    </View>
  </View> : null
}
