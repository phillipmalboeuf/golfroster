import React, { useContext, useState, useRef, Fragment } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'

import { Text, View } from 'react-native'
import { Link, Route, Switch, useHistory } from 'react-router-native'
import { Button, Appbar } from 'react-native-paper'
import { Calendar, Agenda } from 'react-native-calendars'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'
import { StylesContext } from '../contexts/styles'

import { Full, Center } from '../components/layouts'
import { Title, Subtitle } from '../components/text'
import { NewEvent } from '../components/new_event'
import { Event as EventPage } from '../components/event'

import { Dates } from '../components/dates'

import { Event } from '../models/event'
import { Chatroom } from '../models/chatroom'


export const Events: FunctionComponent<{}> = props => {
  // const { user, auth } = useContext(FirebaseContext)
  const { store } = useContext(StoreContext)
  const { colors } = useContext(StylesContext)

  const history = useHistory()

  return <Switch>
    <Route exact path='/events/:id' render={({ match }) => {
      const event = store.events.get(match.params.id)
      return <Fragment key={match.params.id}>
        <Appbar.Header dark={false} style={{ backgroundColor: 'white' }}>
          <Link to='/events'><Appbar.BackAction /></Link>
          <Appbar.Content title={event.name} />
          <Appbar.Action icon='pencil' />
          <Appbar.Action icon='message-outline' onPress={async () => {
            // const chatroom = Array.from(store.chatrooms.values()).find(room => room.event_id === match.params.id)

            // if (chatroom) {
            //   history.push(`/chatrooms/${chatroom.id}`)
            // } else {
            //   await store.createChatroom({
            //     event_id: match.params.id,
            //     // players: [],
            //   }).then(room => {
            //     history.push(`/chatrooms/${(room as any as Instance<typeof Chatroom>).id}`)
            //   })
            // }
          }} />
          <Appbar.Action icon='dots-vertical' />
        </Appbar.Header>

        <EventPage event={event} />
      </Fragment>
    }} />
    <Route exact render={() => <>
      <Appbar.Header>
        <Appbar.Content title='Upcoming Events' />
        <Appbar.Action icon='magnify' />
        <Appbar.Action icon='dots-vertical' />
      </Appbar.Header>
      <Observer>{() => {
        const dates = store.eventDates()
        const markedDates = {}
        Object.keys(dates).forEach(date =>
          markedDates[date] = { dots: dates[date].map(event => ({ key: event.id, color: colors.green })) }
        )

        return <View>
            <Calendar theme={{
                dotColor: colors.green,
                todayTextColor: colors.green,
                dayTextColor: colors.blacks[1],
                textDisabledColor: colors.greys[0],
                arrowColor: colors.blacks[0],
                textDayFontWeight: '400',
                textMonthFontWeight: '400',
              }}
              markedDates={markedDates}
              markingType='multi-dot' />
            {/* <Text>{JSON.stringify(dates)}</Text> */}
            <Dates dates={dates} />
          </View>
      }}</Observer>
      
      <NewEvent />
    </>} />
  </Switch>
}
