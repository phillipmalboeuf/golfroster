import React, { useContext, Fragment, useRef, useState } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'

import { Text, ScrollView } from 'react-native'
import { NativeRouter, Switch, Route, Link, useHistory } from 'react-router-native'
import { Button, Appbar, List } from 'react-native-paper'
import { pick } from 'dot-object'

import { StoreContext } from '../contexts/store'

import { Group } from '../models/group'

import { Full, Center } from './layouts'
import { Dots } from './dots'
import { Form, FormContext } from './form'
import { Input } from './input'
import { Avatar, Upload } from './photos'
import { Title, Subtitle } from './text'


export const InvitesForm: FunctionComponent<{
  group?: Instance<typeof Group>
  onSubmit: () => void
  onCancel: () => void
}> = props => {
  const { store } = useContext(StoreContext)

  const form = useRef<Form>()
  

  return <Form ref={form} values={props.group} onSubmit={async ({invited, ...values}) => {
    if (invited) {
      Object.keys(invited)
        .filter(id => invited[id] === true)
        .filter(id => !props.group.members.includes(id))
        .forEach(id => props.group.invite(id, store.player.id))
    }
    
    props.onSubmit()
  }} hideButton>
    <Dots path='invites' onCancel={() => props.onCancel()} onFinish={() => form.current.submit()} items={[
      <>
        <Title>
          Members
        </Title>

        <Subtitle>
          Who would you like to invite?
        </Subtitle>

        <InvitesList />
      </>,
    ]} />
  </Form>
}

export const InvitesList: FunctionComponent = () => {
  const { store } = useContext(StoreContext)

  return <ScrollView style={{ maxHeight: '75%' }}>
    <FormContext.Consumer>
      {({ values, onChange }) =>
        <List.Section>
          <List.Subheader style={{ textAlign: 'right' }}>{values.invited
            ? Object.keys(values.invited).filter(id => values.invited[id] === true).length
            : 0} invited</List.Subheader>
          {Array.from(store.friends.values()).map(friend => {
            const name = `invited.${friend.id}`
            return <List.Item key={friend.id} title={`${friend.first_name} ${friend.last_name}`}
              onPress={() => onChange(name, pick(name, values) !== undefined ? !pick(name, values) : true)}
              left={() => <Avatar {...friend} small />}
              right={() => <Input name={`invited.${friend.id}`} type='checkbox' />} />
          })}
        </List.Section>
    }</FormContext.Consumer>
  </ScrollView>
}