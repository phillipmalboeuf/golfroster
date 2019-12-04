import React, { useState, useEffect, useContext, FunctionComponent } from 'react'
import { View } from 'react-native'
import { useHistory } from 'react-router'
import { BottomNavigation, DefaultTheme } from 'react-native-paper'
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Observer } from 'mobx-react'

import { StoreContext } from '../contexts/store'
import { StylesContext } from '../contexts/styles'

import { Profile } from '../routes/profile'
import { Events } from '../routes/events'
import { Chatrooms } from '../routes/chatrooms'
import { Players } from '../routes/players'
import { Notifications } from '../routes/notifications'


const routes = [
  { key: 'profile', title: 'Profile', icon: 'account-circle' },
  { key: 'events', title: 'Events', icon: 'calendar' },
  { key: 'chatrooms', title: 'Messages', icon: 'forum' },
  { key: 'players', title: 'Players', icon: 'account-group' },
  { key: 'notifications', title: 'Notifications', icon: 'bell' },
  
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

  return <Observer>
    {() => {
      return <BottomNavigation
        shifting={false}
        navigationState={{
          index,
          routes: routes.map(route => ({ ...route, ...store.badges[route.key] && { badge: store.badges[route.key] }})),
        }}
        onIndexChange={i => {
          setIndex(i)
        }}
        renderScene={scene}
        activeColor={colors.green}
        barStyle={{
          backgroundColor: 'white',
          borderTopColor: colors.greys[0],
          borderTopWidth: 1,
        }}
      />}}
  </Observer>
}
