import React, { useContext, Fragment, useRef, useState } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'

import { Text } from 'react-native'
import { NativeRouter, Switch, Route, Link, useHistory } from 'react-router-native'
import { Button, Appbar, List, Headline, Subheading, FAB } from 'react-native-paper'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'

import { Avatar } from '../components/photos'


export const Notifications: FunctionComponent<{}> = props => {
  const { store } = useContext(StoreContext)
  const history = useHistory()

  return <Observer>
  {() => <>
    <Switch>
      <Route exact path='/notifications/:id' render={({ match }) => {
        return <Fragment key={match.params.id}>
        </Fragment>
      }} />
      <Route exact render={() => <>
        <Appbar.Header>
          <Appbar.Content title='Notifications & Invitations' />
          {/* <Appbar.Action icon='magnify' /> */}
          <Appbar.Action icon='dots-vertical' />
        </Appbar.Header>
        

        <Observer>{() => <List.Section>
          {Array.from(store.notifications.values()).map(notification => <Link key={notification.id} to={`/notifications/${notification.id}`}>
            {{
              group: () => <List.Item title={`${notification.invited_to_name}`}
                description={`${notification.invited_by_name} invited you to join`} />,
            }[notification.invitation_type]()}
          </Link>)}
        </List.Section>}</Observer>
      </>} />
    </Switch>
  </>}
  </Observer>
}
