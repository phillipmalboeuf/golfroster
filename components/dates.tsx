import React, { useContext, useState, useRef } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'

import { Text, View } from 'react-native'
import { Button, Appbar, List, Caption } from 'react-native-paper'
import { Calendar, Agenda } from 'react-native-calendars'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'
import { StylesContext } from '../contexts/styles'

import { Full, Center } from '../components/layouts'
import { Title, Subtitle } from '../components/text'
import { NewEvent } from '../components/new_event'
import { Event as EventModel } from '../models/event'
import moment from 'moment'


export const Dates: FunctionComponent<{
  dates: {[key: string]: Array<Instance<typeof EventModel>>}
}> = ({ dates }) => {
  // const { user, auth } = useContext(FirebaseContext)
  const { store } = useContext(StoreContext)
  const { colors } = useContext(StylesContext)

  return <Observer>
    {() => {
      const keys = Object.keys(dates)
      return keys.length
        ? <>
          {keys.map(date => <List.Section key={date}>
            <List.Subheader>{moment(new Date(date)).format('dddd MMMM Do, YYYY')}</List.Subheader>
            {dates[date].map(event => <List.Item
              title={event.name}
              left={() => <>
                {/* <Caption>{event.start_date.toTimeString()}</Caption> */}
              </>} />)}
          </List.Section>)}
        </>
        : <Text>Empty</Text>
    }}
  </Observer>
}
