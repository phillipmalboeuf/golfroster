import React, { useContext, Fragment, useRef, useState } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'

import { Text, View, ScrollView } from 'react-native'
import { NativeRouter, Switch, Route, Link, useHistory } from 'react-router-native'
import { Button, Appbar, List } from 'react-native-paper'
import { pick } from 'dot-object'

import { StoreContext } from '../contexts/store'
import { StylesContext } from '../contexts/styles'

import { Event as EventModel } from '../models/event'

import { Full, Center } from './layouts'
import { Dots } from './dots'
import { Form, FormContext } from './form'
import { Input } from './input'
import { Avatar, Upload } from './photos'
import { Title, Subtitle } from './text'
import { FloatingButton } from './button'
import { money, drinks, methods, teeChoices } from './player_form'
import { Subscribe } from './subscribe'
import { InvitesList } from './invites_form'

export const list = (values: {[key: string]: boolean}) => {
  return values
    && Object.keys(values).filter(key => values[key] === true)
}

export const preprocess = (values: { [key: string]: any }) => {
  return {
    ...values,
    tee_choices: list(values.tee_choices),
    money: list(values.money),
    drinks: list(values.drinks),
    methods: list(values.methods),
  }
}

export const reduce = (values: string[]) => {
  return values && values.reduce((reduced, value) => {
    return {
      ...reduced,
      [value]: true,
    }
  }, {})
}

export const postprocess = (values: { [key: string]: any }) => {
  return {
    ...values,
    tee_choices: reduce(values.tee_choices),
    money: reduce(values.money),
    drinks: reduce(values.drinks),
    methods: reduce(values.methods),
  }
}

export const EventForm: FunctionComponent<{
  event?: Instance<typeof EventModel>
  onSubmit: () => void
  onCancel: () => void
}> = props => {
  const { store } = useContext(StoreContext)
  const { sizes } = useContext(StylesContext)

  const history = useHistory()

  const form = useRef<Form>()

  return store.player.pro
  ? <Form ref={form} values={props.event && postprocess(props.event)} onSubmit={async ({invited, ...values}) => {
    console.log('submit?')
    if (!props.event) {
      console.log(preprocess(values))
      const event = await store.createEvent(preprocess(values))
      console.log(event)
      if (invited) {
        Object.keys(invited).filter(id => invited[id] === true).forEach(id => event.invite(id, store.player.id))
      }
      history.push(`/events/${event.id}`)
    } else {
      await props.event.save(preprocess(values))
    }

    console.log('done?')
    props.onSubmit()
  }} hideButton>
    <Dots path='new_event' onCancel={() => props.onCancel()} onFinish={() => form.current.submit()} items={[
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
      !props.event && <>
        <Title>
          Event Attendees
        </Title>

        <Subtitle>
          Who would you like to invite to this event?
        </Subtitle>

        <InvitesList />
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
    ].filter(element => element as any as boolean !== false)} />
  </Form>
  : <Subscribe label='Event Creation' onCancel={props.onCancel} />
}
