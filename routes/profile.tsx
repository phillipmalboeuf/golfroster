import React, { useContext, useState } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'

import { Text, View } from 'react-native'
import { Button, Appbar, Headline, Caption, List as PaperList } from 'react-native-paper'
import { Link, Switch, Route, useHistory } from 'react-router-native'

import { StoreContext } from '../contexts/store'

import { Center, Padded, Spaced, Full } from '../components/layouts'
import { Avatar, Background } from '../components/photos'
import { Player } from '../components/player'
import { PlayerForm } from '../components/player_form'
import { Menu, MenuItem } from '../components/menu'
import { List } from '../components/list'
import { ContactForm } from '../components/contact_form'


export const Profile: FunctionComponent<{}> = props => {
  const { store: { player, logout } } = useContext(StoreContext)

  const history = useHistory()
  const [editing, setEditing] = useState(false)

  return <Switch>
    <Route exact path='/profile/settings/help'>
      <Appbar.Header dark={false} style={{ backgroundColor: 'white' }}>
        <Link to='/profile/settings'><Appbar.BackAction /></Link>
        <Appbar.Content title='Help & Contact Us' />
      </Appbar.Header>

      <ContactForm />
    </Route>
    <Route exact path='/profile/settings'>
      <Appbar.Header dark={false} style={{ backgroundColor: 'white' }}>
        <Link to='/profile'><Appbar.BackAction /></Link>
        <Appbar.Content title='User Settings' />
      </Appbar.Header>

      <List sections={[{
        items: [
          {
            title: 'Account Settings',
            description: 'Modify your email address and password',
            left: <PaperList.Icon icon='account-circle' />,
          },
          {
            title: 'Notifications Settings',
            description: 'Choose how you’d like to be notified',
            left: <PaperList.Icon icon='bell' />,
          },
          {
            title: 'Blocked Users',
            description: 'Review your list of blocked users',
            left: <PaperList.Icon icon='cancel' />,
          },
          {
            title: 'Privacy Settings',
            description: 'Choose what data you’d like to share with us',
            left: <PaperList.Icon icon='cellphone-lock' />,
          },
          {
            title: 'Sign out',
            description: 'Sign out to switch accounts',
            left: <PaperList.Icon icon='logout' />,
          },
          {
            title: 'Help & Contact Us',
            description: 'If you need anything, get in touch',
            left: <PaperList.Icon icon='help-circle' />,
            link: '/profile/settings/help',
          },
          {
            title: 'Privacy & Terms of Use',
            description: 'Review our Privacy Policy & Terms of Use',
            left: <PaperList.Icon icon='file-multiple' />,
          },
        ],
      }]} />
    </Route>
    <Route exact>
      <Appbar.Header>
        <Appbar.Content title='Your Player Profile' />
        <Appbar.Action icon='account-edit' onPress={() => setEditing(true)} />
        <Appbar.Action icon='settings' onPress={() => history.push('/profile/settings')} />
        <Menu>
          <MenuItem onPress={() => logout()} title='Logout' />
        </Menu>
      </Appbar.Header>
      
      <Player player={player} />

      {editing && <Full><PlayerForm onSubmit={() => setEditing(false)} onCancel={() => setEditing(false)} /></Full>}
    </Route>
  </Switch>
}
