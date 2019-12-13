import React, { useContext, useState, useRef } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'
import moment from 'moment'

import { Text, View } from 'react-native'
import { Link } from 'react-router-native'

import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'
import { StylesContext } from '../contexts/styles'

import { Event as EventModel } from '../models/event'
import { List } from './list'


export const Dates: FunctionComponent<{
  dates: {[key: string]: Array<Instance<typeof EventModel>>}
}> = ({ dates }) => {
  // const { user, auth } = useContext(FirebaseContext)
  const { store } = useContext(StoreContext)
  const { colors } = useContext(StylesContext)

  return <Observer>
    {() => {
      const keys = Object.keys(dates).sort()
      return keys.length
        ? <List sections={keys.map(date => ({
          title: moment(new Date(date)).format('dddd MMMM Do, YYYY'),
          items: dates[date].map(event => ({
            title: event.name,
            link: `/events/${event.id}`,
          })),
        }))} />
        : null
    }}
  </Observer>
}
