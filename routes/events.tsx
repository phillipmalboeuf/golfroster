import React, { useContext, useState, useRef } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'

import { Text, View } from 'react-native'
import { Button, Appbar } from 'react-native-paper'
import { Calendar, Agenda } from 'react-native-calendars'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'
import { StylesContext } from '../contexts/styles'

import { Full, Center } from '../components/layouts'
import { Title, Subtitle } from '../components/text'
import { NewEvent } from '../components/new_event'
import { Event } from '../models/event'
import { Dates } from '../components/dates'


export const Events: FunctionComponent<{}> = props => {
  // const { user, auth } = useContext(FirebaseContext)
  const { store } = useContext(StoreContext)
  const { colors } = useContext(StylesContext)

  return <>
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
  </>
}
