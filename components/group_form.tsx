import React, { useContext, Fragment, useRef, useState } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'

import { Text } from 'react-native'
import { NativeRouter, Switch, Route, Link, useHistory } from 'react-router-native'
import { Button, Appbar, List } from 'react-native-paper'
import { pick } from 'dot-object'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'

import { Group } from '../models/group'

import { Full, Center } from './layouts'
import { Dots } from './dots'
import { Form, FormContext } from './form'
import { Input } from './input'
import { Avatar, Upload } from './photos'
import { Title, Subtitle } from './text'
import { FloatingButton } from './button'
import { postprocess } from './event_form'
import { states } from './player_form'


export const GroupForm: FunctionComponent<{
  group?: Instance<typeof Group>
  onSubmit: () => void
  onCancel: () => void
}> = props => {
  const { store } = useContext(StoreContext)
  const history = useHistory()

  const form = useRef<Form>()
  

  return <Form ref={form} values={props.group && postprocess(props.group)} onSubmit={async ({invited, ...values}) => {
    if (!props.group) {
      const group = await store.createGroup(values)
      Object.keys(invited).filter(id => invited[id] === true).forEach(id => group.invite(id, store.player.id))
      history.push(`/groups/${group.id}`)
    } else {
      await props.group.save(values)
    }
    
    props.onSubmit()
  }} hideButton>
    <Dots path='new_group' onCancel={() => props.onCancel()} onFinish={() => form.current.submit()} items={[
      !props.group && <>
        <Title>
          Group Members
        </Title>

        <Subtitle>
          Who would you like to invite to the group?
        </Subtitle>

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
      </>,
      <Center>
        <Title>
          This Group's City and State
        </Title>

        <Subtitle>
          Which city does this group represent?
        </Subtitle>

        <Input name='city' label='City' />
        <Input name='state' label='State' type='picker' options={Object.keys(states).map(state => ({
          value: state,
          label: states[state],
        }))} />
      </Center>,
      <>
        <Title>
          Give it a name
        </Title>

        <Subtitle>
          Finally, give your group a name, a description, and a fun photo.
        </Subtitle>

        <Input name='name' label='Group Name' />
        <Input name='description' type='multiline' label='Description' />

        <FormContext.Consumer>
          {context => <Upload onUpload={url => {
            context.onChange('photo', url)
          }} />}
        </FormContext.Consumer>
      </>,
      <>
        <Title>
          Visibility
        </Title>

        <Input name='is_public' type='checkbox' label='Is this group public?' />
      </>,
    ].filter(element => element as any as boolean !== false)} />
  </Form>
}
