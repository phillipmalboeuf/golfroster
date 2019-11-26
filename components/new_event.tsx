import React, { useContext, Fragment, useRef, useState } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'

import { Text } from 'react-native'
import { NativeRouter, Switch, Route, Link, useHistory } from 'react-router-native'
import { Button, Appbar, List } from 'react-native-paper'
import { pick } from 'dot-object'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'

import { Full, Center } from './layouts'
import { Dots } from './dots'
import { Form, FormContext } from './form'
import { Input } from './input'
import { Avatar } from './photos'
import { Title, Subtitle } from './text'
import { FloatingButton } from './button'


export const NewEvent: FunctionComponent<{}> = props => {
  const { store } = useContext(StoreContext)
  const history = useHistory()

  const form = useRef<Form>()
  const [building, setBuilding] = useState(false)

  return <>
    {building && <Full>
      <Form ref={form} onSubmit={async values => {
        console.log(values)
        await store.createEvent({
          ...values,
          // invited: Object.keys(values.invited).filter(id => values.invited[id] === true),
        })
        // setBuilding(false)
      }} hideButton>
        <Dots path='new_event' onCancel={() => setBuilding(false)} onFinish={() => form.current.submit()} items={[
          <Center>
            <Title>
              Tee-off Time
            </Title>

            <Subtitle>
              When is this event starting?
            </Subtitle>

            <Input name='start_date' type='datetime' />

            <Subtitle>
              And when is it ending?
            </Subtitle>

            <Input name='end_date' type='datetime' />

            <Input name='is_repeatable' type='checkbox' label='Is this event repeatable?' />
          </Center>,
          <Center>
            <Title>
              Give it a name
            </Title>

            <Subtitle>
              Finally, give your event a name and a description.
            </Subtitle>

            <Input name='name' label='Event Name' />
            <Input name='description' type='multiline' label='Description' />
          </Center>,
        ]} />
      </Form>
    </Full>}
    <FloatingButton
      icon='plus'
      onPress={() => setBuilding(true)}
    />
  </>
}
