import React, { useContext, Fragment, useRef, useState } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'

import { Text, View } from 'react-native'
import { NativeRouter, Switch, Route, Link, useHistory } from 'react-router-native'
import { Button, Appbar, List } from 'react-native-paper'
import { pick } from 'dot-object'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'
import { StylesContext } from '../contexts/styles'

import { Full, Center } from './layouts'
import { Dots } from './dots'
import { Form, FormContext } from './form'
import { Input } from './input'
import { Avatar, Upload } from './photos'
import { Title, Subtitle } from './text'
import { FloatingButton } from './button'
import { money, drinks, methods, teeChoices } from './new_player'


export const NewEvent: FunctionComponent<{}> = props => {
  const { store } = useContext(StoreContext)
  const { sizes } = useContext(StylesContext)

  const history = useHistory()

  const form = useRef<Form>()
  const [building, setBuilding] = useState(false)

  return <>
    {building && <Full>
      <Form ref={form} onSubmit={async values => {
        console.log(values)
        await store.createEvent({
          ...values,
          tee_choices: values.tee_choices
            && Object.keys(values.tee_choices).filter(key => values.tee_choices[key] === true),
          money: values.money
            && Object.keys(values.money).filter(key => values.money[key] === true),
          drinks: values.drinks
            && Object.keys(values.drinks).filter(key => values.drinks[key] === true),
          methods: values.methods
            && Object.keys(values.methods).filter(key => values.methods[key] === true),
          invited: Object.keys(values.invited).filter(id => values.invited[id] === true),
        })
        // setBuilding(false)
      }} hideButton>
        <Dots path='new_event' onCancel={() => setBuilding(false)} onFinish={() => form.current.submit()} items={[
          <Center>
            <Title>
              Tee-off Time
            </Title>

            <Subtitle topMargin>
              When is this event starting?
            </Subtitle>

            <Input name='start_date' type='datetime' label='Start' />

            <Subtitle topMargin>
              And when is it ending?
            </Subtitle>

            <Input name='end_date' type='datetime' label='End' />

            <Input name='is_repeatable' type='checkbox' label='Is this event repeatable?' />
          </Center>,
          <Center>
            <Title>
              Tee Choice
            </Title>

            <Subtitle>
              From where will you swing? (select all that apply)
            </Subtitle>

            {Object.keys(teeChoices)
              .map(key => <Input key={key} name={`tee_choices.${key}`} type='checkbox' label={teeChoices[key]} />)}
          </Center>,
          <Center>
            <Title>
              Socializing
            </Title>

            <Subtitle>
              Would this be for money? (select all that apply)
            </Subtitle>

            {Object.keys(money)
              .map(key => <Input key={key} name={`money.${key}`} type='checkbox' label={money[key]} />)}

            <View style={{ marginBottom: sizes.base * 2 }} />

            <Subtitle>
              Will you drink on the golf course? (select all that apply)
            </Subtitle>

            {Object.keys(drinks)
              .map(key => <Input key={key} name={`drinks.${key}`} type='checkbox' label={drinks[key]} />)}
          </Center>,
          <Center>
            <Title>
              Methods of Play
            </Title>

            <Subtitle>
              What will be your preferred method of play? (select all that apply)
            </Subtitle>

            {Object.keys(methods)
              .map(key => <Input key={key} name={`methods.${key}`} type='checkbox' label={methods[key]} />)}
          </Center>,
          <>
            <Title>
              Number of Members
            </Title>

            <Subtitle>
              How many players are you expecting?
            </Subtitle>
            <FormContext.Consumer>
              {({ values }) =>
                <Input name='expected_number_of_members' type='number' label='Number'
                  disabled={values.has_unlimited_number_of_players} />}
            </FormContext.Consumer>
            <Input name='has_unlimited_number_of_players' type='checkbox' label='Or is unlimited?' />
          </>,
          <>
            <Title>
              Group Members
            </Title>

            <Subtitle>
              Who would you like to invite to this event?
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
                  {/* {Array.from(store.groups.values()).map(group =>
                    <List.Item key={group.id} title={group.name}
                      right />
                  )} */}
                </List.Section>
            }</FormContext.Consumer>
          </>,
          <Center>
            <Title>
              Give it a name
            </Title>

            <Subtitle>
              Finally, give your event a name, a description, and a fun photo.
            </Subtitle>

            <Input name='name' label='Event Name' />
            <Input name='description' type='multiline' label='Description' />

            <FormContext.Consumer>
              {context => <Upload onUpload={url => {
                context.onChange('photo', url)
              }} />}
            </FormContext.Consumer>
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
