import React, { useContext, Fragment, useRef, useState } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'
import moment from 'moment'

import { Text, View } from 'react-native'
import { NativeRouter, Switch, Route, Link, useHistory } from 'react-router-native'
import { Button, Appbar, List, Headline, Subheading, FAB, Portal, Modal, Caption } from 'react-native-paper'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'

import { Avatar } from '../components/photos'
import { Popup } from '../components/popup'


export const Notifications: FunctionComponent<{}> = props => {
  const { store } = useContext(StoreContext)
  const history = useHistory()

  return <Observer>
  {() => <>
    <Switch>
      <Route exact path='/notifications/:id' render={({ match }) => {
        return <Popup key={match.params.id} onDismiss={() => history.push('/notifications')}
          title={`Reply`}
          content={<Text>Reply to this</Text>}
          actions={[{
            label: 'Decline',
            onPress: async () => {
              await store.notifications.get(match.params.id).hide()
              history.push('/notifications')
            },
          }, {
            label: 'Accept',
            onPress: async () => {
              await store.joinGroup(store.notifications.get(match.params.id).invited_to_id)
              await store.notifications.get(match.params.id).accept()
              history.push('/notifications')
            },
          }]}
        />
      }} />
    </Switch>

    <Route exact render={() => <>
      <Appbar.Header>
        <Appbar.Content title='Notifications & Invitations' />
        {/* <Appbar.Action icon='magnify' /> */}
        <Appbar.Action icon='dots-vertical' />
      </Appbar.Header>
      

      <List.Section>
        {Array.from(store.notifications.values()).map(notification => <Link key={notification.id} to={`/groups/${notification.invited_to_id}`}>
          {{
            group: () => <List.Item title={`${notification.invited_to_name}`}
              description={notification.invited_by_name
                ? `${notification.invited_by_name} invited you to join`
                : 'You were invited to join'}
              right={() => <Observer>{() => notification.accepted
                ? <View style={{ flexDirection: 'column' }}>
                  <Caption>{moment(notification.date).fromNow()}</Caption>
                  <Text style={{ textAlign: 'right' }}>Accepted</Text>
                </View>
                : <Link to={`/notifications/${notification.id}`} style={{ flexDirection: 'column' }}>
                  <>
                    <Caption>{moment(notification.date).fromNow()}</Caption>
                    <Button uppercase={false} mode='outlined'>Reply</Button>
                  </>
                </Link>}</Observer>} />,
          }[notification.invitation_type]()}
        </Link>)}
      </List.Section>
    </>} />
  </>}
  </Observer>
}
