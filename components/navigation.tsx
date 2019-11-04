import React, { useState, useEffect, useContext, FunctionComponent } from 'react'
import { View } from 'react-native'
import { BottomNavigation, DefaultTheme } from 'react-native-paper'
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { Profile } from '../routes/profile'
import { Events } from '../routes/events'
import { Messages } from '../routes/messages'
import { Players } from '../routes/players'
import { Notifications } from '../routes/notifications'


const routes = [
  { key: 'events', title: 'Events', icon: 'calendar' },
  { key: 'messages', title: 'Messages', icon: 'forum' },
  { key: 'players', title: 'Players', icon: 'account-group' },
  { key: 'notifications', title: 'Notifications', icon: 'bell' },
  { key: 'profile', title: 'Profile', icon: 'account-circle' },
]

const scene = BottomNavigation.SceneMap({
  events: Events,
  messages: Messages,
  players: Players,
  notifications: Notifications,
  profile: Profile,
})

export const Navigation: FunctionComponent<{}> = props => {
  const [index, setIndex] = useState(1)

  return <BottomNavigation
    shifting={false}
    navigationState={{
      index,
      routes,
    }}
    onIndexChange={i => setIndex(i)}
    renderScene={scene}
    barStyle={{
      zIndex: -1,
      backgroundColor: '#fff',
      borderTopColor: '#F5F5F5',
      borderTopWidth: 1,
    }}
  />
}
