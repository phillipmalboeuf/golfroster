import React, { useState, useEffect, useContext, FunctionComponent } from 'react'
import { View } from 'react-native'
import { useHistory } from 'react-router'
import { BottomNavigation, DefaultTheme } from 'react-native-paper'
import { Observer } from 'mobx-react'
import messaging from '@react-native-firebase/messaging'

import { StoreContext } from '../contexts/store'
import { StylesContext } from '../contexts/styles'

import { Profile } from '../routes/profile'
import { Events } from '../routes/events'
import { Chatrooms } from '../routes/chatrooms'
import { Players } from '../routes/players'
import { Notifications } from '../routes/notifications'


const routes = [
  { key: 'events', title: 'Events', icon: 'calendar' },
  { key: 'chatrooms', title: 'Messages', icon: 'forum' },
  { key: 'players', title: 'Players', icon: 'account-group' },
  { key: 'notifications', title: 'Notifications', icon: 'bell' },
  { key: 'profile', title: 'Profile', icon: 'account-circle' },
]

const scene = BottomNavigation.SceneMap({
  events: Events,
  chatrooms: Chatrooms,
  players: Players,
  notifications: Notifications,
  profile: Profile,
})

export const Navigation: FunctionComponent<{}> = props => {
  const [index, setIndex] = useState(2)

  const { store } = useContext(StoreContext)
  const { colors } = useContext(StylesContext)
  const history = useHistory()

  useEffect(() => {
    const root = history.location.pathname.split('/')[1]
    setIndex(routes.findIndex(route => route.key.includes(root === 'groups' ? 'players' : root)))
  }, [history.location])

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage.data.type === 'notification') {
        history.push(`/notifications`)
      } else if (remoteMessage.data.type === 'chat') {
        history.push(`/chatrooms/${remoteMessage.data.id}`)
      }
    })
  }, [])

  return <BottomNavigation
    shifting={false}
    navigationState={{
      index,
      routes: routes.map(route => ({ ...route, ...store.badges[route.key] && { badge: store.badges[route.key] }})),
    }}
    onIndexChange={i => {
      history.push(`/${routes[i].key}`)
      // setIndex(i)
    }}
    renderScene={scene}
    activeColor={colors.green}
    barStyle={{
      backgroundColor: 'white',
      borderTopColor: colors.greys[0],
      borderTopWidth: 1,
    }}
  />
}
