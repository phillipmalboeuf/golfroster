import React, { useContext, useState } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'

import { Text, View, ScrollView, Linking } from 'react-native'
import { Appbar, Headline, Caption, Card, Paragraph } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { StoreContext } from '../contexts/store'
import { StylesContext } from '../contexts/styles'
import { Player as PlayerModel } from '../models/player'

import { Center, Padded } from './layouts'
import { Avatar, Background } from './photos'
import { Button } from './button'
import { Subheader, Italic, Bold, Quote } from './text'
import { List } from './list'
import { timesOfDay, teeChoices, methods, money, drinks } from './player_form'


export const Player: FunctionComponent<{
  player: Instance<typeof PlayerModel>
}> = ({ player }) => {
  const { store } = useContext(StoreContext)
  const { colors, sizes } = useContext(StylesContext)

  return <ScrollView>
    <Observer>
    {() => <>
      {player.id === store.player.id && <>
        <ProMembership onPress={() => {
          Linking.openURL(`http://localhost:8080?email=${store.player.email}`)
        }} />
      </>}
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
        
      {player.bio && <Quote>{player.bio}</Quote>}

      <Padded tight>
        <Subheader>{player.first_name}'s Clubs</Subheader>
        <List sections={[{
          items: player.clubs.map(club => ({
            title: club,
            // link: `/clubs/${club}`,
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

const ProMembership: FunctionComponent<{
  onPress?: () => void
}> = props => {
  const [visible, setVisible] = useState(true)
  const { sizes, colors } = useContext(StylesContext)
  const { store } = useContext(StoreContext)

  return (!store.player.pro && store.askingForPro && visible)
    ? <Card style={{ backgroundColor: colors.faded, paddingTop: sizes.base, shadowOpacity: 0 }}>
      <Card.Title titleStyle={{
        fontSize: sizes.big,
        lineHeight: sizes.big * 1.5,
        fontWeight: 'normal',
      }} title='Sign up for Pro' />
      <Card.Content style={{ paddingHorizontal: sizes.base, marginBottom: sizes.base }}>
        <Paragraph>
          With a pro membership, you'll be able to organize an unlimited number of events,
          and create groups of players yourself.
        </Paragraph>
      </Card.Content>
      <Card.Actions style={{
        justifyContent: 'space-between',
        paddingHorizontal: sizes.base,
        paddingVertical: sizes.base / 2,
        borderTopColor: colors.greys[0],
        borderTopWidth: 1,
      }}>
        <Button contained black pill icon='account-card-details-outline' onPress={props.onPress}>Sign Up</Button>
        <Button onPress={() => {
          store.stopAskingForPro()
          setVisible(false)
        }}>Close</Button>
      </Card.Actions>
    </Card>
    : null
}
