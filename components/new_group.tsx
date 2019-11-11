import React, { useContext, Fragment, useRef, useState } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'

import { Text } from 'react-native'
import { NativeRouter, Switch, Route, Link, useHistory } from 'react-router-native'
import { Button, Appbar, List, Headline, Subheading, FAB } from 'react-native-paper'
import { pick } from 'dot-object'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'

import { Full, Center } from './layouts'
import { Dots } from './dots'
import { Form, FormContext } from './form'
import { Input } from './input'
import { Avatar } from './photos'


export const NewGroup: FunctionComponent<{}> = props => {
  const { store } = useContext(StoreContext)
  const history = useHistory()

  const form = useRef<Form>()
  const [building, setBuilding] = useState(false)

  return <>
    {building && <Full>
      <Form ref={form} onSubmit={async values => {
        console.log(values)
        await store.createGroup({
          ...values,
          invited: Object.keys(values.invited).filter(id => values.invited[id] === true),
        })
        // setBuilding(false)
      }} hideButton>
        <Dots path='new_group' onCancel={() => setBuilding(false)} onFinish={() => form.current.submit()} items={[
          // <>
          //   <Headline>
          //     Number of Members
          //   </Headline>

          //   <Subheading>
          //     How many players are you expecting?
          //   </Subheading>
          //   <FormContext.Consumer>
          //     {({ values }) =>
          //       <Input name='expected_number_of_members' type='number' label='Number'
          //         disabled={values.has_unlimited_number_of_players} />}
          //   </FormContext.Consumer>
          //   <Input name='has_unlimited_number_of_players' type='checkbox' label='Or is unlimited?' />
          // </>,
          <>
            <Headline>
              Group Members
            </Headline>

            <Subheading>
              Who would you like to invite to the group?
            </Subheading>

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
                  {/* {Array.from(store.groups.values()).map(group =>
                    <List.Item key={group.id} title={group.name}
                      right />
                  )} */}
                </List.Section>
            }</FormContext.Consumer>
          </>,
          <>
            <Headline>
              Give it a name
            </Headline>

            <Subheading>
              Finally, give your group a name and a description.
            </Subheading>

            <Input name='name' label='Group Name' />
            <Input name='description' type='multiline' label='Description' />
          </>,
          <>
            <Headline>
              Visibility
            </Headline>

            <Input name='is_public' type='checkbox' label='Is this group public?' />
          </>,
        ]} />
      </Form>
    </Full>}
    <FAB
      style={{
        position: 'absolute',
        right: 16,
        bottom: 25,
      }}
      icon='plus'
      onPress={() => setBuilding(true)}
    />
  </>
}
