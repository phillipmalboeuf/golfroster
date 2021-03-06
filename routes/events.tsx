import React, { useContext, useState, useRef, Fragment } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'

import { Text, View, ScrollView, Dimensions } from 'react-native'
import { Link, Route, Switch, useHistory } from 'react-router-native'
import { Button, Appbar } from 'react-native-paper'
import { Calendar, Agenda } from 'react-native-calendars'

import { StoreContext } from '../contexts/store'
import { StylesContext } from '../contexts/styles'

import { Full, Center } from '../components/layouts'
import { Title, Subtitle } from '../components/text'
import { EventForm } from '../components/event_form'
import { Event as EventPage } from '../components/event'
import { Search } from '../components/search'

import { Dates } from '../components/dates'

import { Event } from '../models/event'
import { Chatroom } from '../models/chatroom'
import { FloatingButton } from '../components/button'
import { Empty } from '../components/empty'
import { Menu, MenuItem } from '../components/menu'


export const Events: FunctionComponent<{}> = props => {
  const { store } = useContext(StoreContext)
  const { colors } = useContext(StylesContext)

  const history = useHistory()

  const [searching, setSearching] = useState(false)
  const [building, setBuilding] = useState(false)
  const [editing, setEditing] = useState(false)

  return <Switch>
    <Route exact path='/events/:id' render={({ match }) => {
      const event = store.events.get(match.params.id)
      return <Fragment key={match.params.id}>
        <Appbar.Header dark={false} style={{ backgroundColor: 'white' }}>
          <Link to='/events'><Appbar.BackAction /></Link>
          <Appbar.Content title={event.name} />
          <Appbar.Action icon='pencil' onPress={() => setEditing(true)} />
          <Appbar.Action icon='message-outline' onPress={async () => {
            const chatroom = Array.from(store.chatrooms.values()).find(room => room.event_id === match.params.id)

            if (chatroom) {
              history.push(`/chatrooms/${chatroom.id}`)
            } else {
              await store.createChatroom({
                event_id: match.params.id,
                players: event.members.filter(attendee => attendee !== store.player.id),
              }).then(room => {
                history.push(`/chatrooms/${(room as any as Instance<typeof Chatroom>).id}`)
              })
            }
          }} />
          <Menu light />
        </Appbar.Header>

        <EventPage event={event} />
        {editing && <Full><EventForm event={event} 
          onSubmit={() => setEditing(false)} onCancel={() => setEditing(false)} /></Full>}
      </Fragment>
    }} />
    <Route exact render={() => <>
      <Appbar.Header>
        <Appbar.Content title='Upcoming Events' />
        <Appbar.Action icon='magnify' onPress={() => setSearching(true)} />
        <Menu />
      </Appbar.Header>

      <Search visible={searching} onDismiss={() => setSearching(false)} index='events'
        renderHit={hit => `${hit.name}`} />

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
            
            {Object.keys(dates).length
              ? <ScrollView style={{ maxHeight: Dimensions.get('screen').height - 500 }}>
                <Dates dates={dates} />
              </ScrollView>
              : <View style={{ marginTop: -150 }}>
                <Empty label='Your events will appear here.' icon={'calendar'} />
              </View>}
            
          </View>
      }}</Observer>
      
      {building && <Full><EventForm onSubmit={() => setBuilding(false)} onCancel={() => setBuilding(false)} /></Full>}
      <FloatingButton
        icon='plus'
        onPress={() => setBuilding(true)}
      />
    </>} />
  </Switch>
}
