import React, { useContext, Fragment, useRef, useState, useEffect } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'
import moment from 'moment'

import { Text, View, ScrollView } from 'react-native'
import { NativeRouter, Switch, Route, Link, useHistory } from 'react-router-native'
import { Button, Appbar, List, Caption } from 'react-native-paper'

import { StoreContext } from '../contexts/store'

import { Avatar } from '../components/photos'
import { Popup } from '../components/popup'
import { Empty } from '../components/empty'
import { Menu, MenuItem } from '../components/menu'

export const Notifications: FunctionComponent<{}> = props => {
  const { store } = useContext(StoreContext)
  const history = useHistory()

  return <Observer>
  {() => <>
    <Switch>
      <Route exact path='/notifications/:id' render={({ match }) => {
        const notification = store.notifications.get(match.params.id)
        return <Popup key={match.params.id} onDismiss={() => history.push('/notifications')}
          title={`Reply`}
          content={<Text>Reply to this</Text>}
          actions={[{
            label: 'Decline',
            onPress: async () => {
              await notification.hide()
              history.push('/notifications')
            },
          }, {
            label: 'Accept',
            onPress: async () => {
              await ({
                group: () => store.joinGroup(notification.subject_id),
                event: () => store.attendEvent(notification.subject_id),
                player: () => store.player.requestFriend(notification.subject_id),
              }[notification.type]())

              await notification.accept()
              history.push('/notifications')
            },
          }]}
        />
      }} />
    </Switch>

    <Route exact path='/notifications' render={() => {
      const notifications = Array.from(store.notifications.values())
      notifications.filter(notification => !notification.seen).forEach(notification => {
        notification.see()
      })
      const highlight = { backgroundColor: 'white' }
      return <>
        <Appbar.Header>
          <Appbar.Content title='Notifications & Invitations' />
          <Menu />
        </Appbar.Header>
        
        <ScrollView>
          <Observer>{() => notifications.length ? <List.Section>
            {notifications.map(notification => <Link key={notification.id} to={`/${notification.type.replace('_accepted', '')}s/${notification.subject_id}`}>
              {{
                group: () => <List.Item style={!notification.accepted && highlight} title={`${notification.subject_name}`}
                  description={notification.sent_by_name
                    ? `${notification.sent_by_name} invited you to join`
                    : 'You were invited to join'}
                  right={() => <AcceptButton notification={notification} />} />,
                event: () => <List.Item style={!notification.accepted && highlight} title={`${notification.subject_name}`}
                  description={notification.sent_by_name
                    ? `${notification.sent_by_name} invited you to attend`
                    : 'You were invited to attend'}
                  right={() => <AcceptButton notification={notification} />} />,
                player: () => store.friends.has(notification.subject_id) 
                ? <List.Item style={!notification.accepted && highlight} title={`${notification.subject_name}`}
                  description={'has accepted your friend request!'} />
                : <List.Item style={!notification.accepted && highlight} title={`${notification.subject_name}`}
                  description={'has sent you a friend request'}
                  right={() => <AcceptButton notification={notification} />} />,
                group_accepted: () => <List.Item title={`${notification.sent_by_name} has accepted your invitation to join ${notification.subject_name}!`} />,
                event_accepted: () => <List.Item title={`${notification.sent_by_name} has accepted your invitation to attend ${notification.subject_name}!`}
                  titleNumberOfLines={2}
                  right={() => <Caption>{moment(notification.date).fromNow()}</Caption>} />,
              }[notification.type]()}
            </Link>)}
          </List.Section> : <Empty label={'Your notifications will appear here.'} icon={'bell'} />}</Observer>
        </ScrollView>
      </>
    }} />
  </>}
  </Observer>
}

const AcceptButton: FunctionComponent<{
  notification
}> = ({ notification }) => {
  return <Observer>{() => notification.accepted
    ? <View style={{ flexDirection: 'column' }}>
      <Caption>{moment(notification.date).fromNow()}</Caption>
      <Text style={{ textAlign: 'right' }}>Accepted</Text>
    </View>
    : <Link to={`/notifications/${notification.id}`} style={{ flexDirection: 'column' }}>
      <>
        <Caption>{moment(notification.date).fromNow()}</Caption>
        <Button uppercase={false} mode='outlined'>Reply</Button>
      </>
    </Link>}</Observer>
}
