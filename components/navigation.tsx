import React, { useState, useEffect, useContext } from 'react'
import { View } from 'react-native'
import { BottomNavigation, DefaultTheme } from 'react-native-paper'
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { Profile } from '../routes/profile'
import { Events } from '../routes/events'
import { Messages } from '../routes/messages'
import { Players } from '../routes/players'
import { Notifications } from '../routes/notifications'

export class Navigation extends React.Component {
  public state = {
    index: 0,
    routes: [
      { key: 'events', title: 'Events', icon: 'calendar' },
      { key: 'messages', title: 'Messages', icon: 'forum' },
      { key: 'players', title: 'Players', icon: 'account-group' },
      { key: 'notifications', title: 'Notifications', icon: 'bell' },
      { key: 'profile', title: 'Profile', icon: 'account-circle' },
    ],
  }

  public scene = BottomNavigation.SceneMap({
    events: Events,
    messages: Messages,
    players: Players,
    notifications: Notifications,
    profile: Profile,
  })

  public render() {
    return (
      <BottomNavigation
        shifting={false}
        navigationState={this.state}
        onIndexChange={index => this.setState({ index })}
        renderScene={this.scene}
        barStyle={{
          zIndex: -1,
        }}
      />
    )
  }
}
