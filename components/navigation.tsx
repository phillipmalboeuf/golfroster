import React, { useState, useEffect, useContext } from 'react'
import { View } from 'react-native'
import { BottomNavigation, DefaultTheme } from 'react-native-paper'

import { Profile } from '../routes/profile'
import { Events } from '../routes/events'
import { Messages } from '../routes/messages'
import { Players } from '../routes/players'
import { Notifications } from '../routes/notifications'

export class Navigation extends React.Component {
  public state = {
    index: 0,
    routes: [
      // { key: 'events', title: 'Events', icon: 'event' },
      { key: 'events', title: 'Events' },
      // { key: 'messages', title: 'Messages', icon: 'forum' },
      { key: 'messages', title: 'Messages' },
      // { key: 'players', title: 'Players', icon: 'account-circle' },
      { key: 'players', title: 'Players' },
      // { key: 'notifications', title: 'Notifications', icon: 'notifications' },
      { key: 'notifications', title: 'Notifications' },
      // { key: 'profile', title: 'Profile', icon: 'account-circle' },
      { key: 'profile', title: 'Profile' },
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
      />
    )
  }
}
