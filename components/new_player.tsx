import React, { useContext, useRef, useState } from 'react'
import { FunctionComponent } from 'react'

import { View, Text, Dimensions } from 'react-native'
import { Button, Headline, Subheading, Caption } from 'react-native-paper'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'
import { StylesContext } from '../contexts/styles'

import { Form } from './form'
import { Input } from './input'
import { Center } from './layouts'
import { Dots } from './dots'
import { Link, Redirect } from 'react-router-native'
import { Title, Subtitle } from './text'

export const timesOfDay = {
  early_morning: 'Early morning',
  mid_morning: 'Mid-morning',
  afternoon: 'Afternoon',
  twilight: 'Twilight',
}

export const teeChoices = {
  ladies: 'Ladies (5,600 or less)',
  seniors: 'Seniors – Men’s Average (5,600 – 6,200 yds)',
  men: 'Men – advanced (6,200 - 6,800 yds)',
  championship: 'Championship / tips (6,800 yds +)',
}

export const money = {
  big: 'I play big money',
  regularly: 'Yes, Regularly',
  when_others: 'When others in the group want to',
  for_fun: 'I play for fun',
}

export const drinks = {
  not_on: 'Not on the course',
  why_else: 'Why else would you play golf?',
  a_couple: 'A couple drinks a side',
}

export const methods = {
  walk: 'Walk',
  ride: 'Ride',
  caddy: 'Caddy',
}


export const NewPlayer: FunctionComponent<{}> = props => {
  const { store } = useContext(StoreContext)
  const { sizes } = useContext(StylesContext)
  const form = useRef<Form>(undefined)

  return <Form ref={form} hideButton onSubmit={async values => {
    store.player.save({
      ...values,
      weekends: Object.keys(values.weekends).filter(key => values.weekends[key] === true),
      weekdays: Object.keys(values.weekends).filter(key => values.weekends[key] === true),
      tee_choices: Object.keys(values.tee_choices).filter(key => values.tee_choices[key] === true),
      money: Object.keys(values.money).filter(key => values.money[key] === true),
      drinks: Object.keys(values.drinks).filter(key => values.drinks[key] === true),
      methods: Object.keys(values.methods).filter(key => values.methods[key] === true),
      accepted_terms: true,
    })
  }} cta='Continue with Email'>
    <Dots path='profile_buildup' onFinish={() => {
      form.current.submit()
    }} items={[
      <Center>
        <Title>
          Let’s Get to Know You
        </Title>

        <Subtitle>
          How would you like to be addressed?
        </Subtitle>

        <Input name='first_name' label='First Name' />
        <Input name='last_name' label='Last Name' />
      </Center>,
      <Center>
        <Title>
          Your City and State
        </Title>

        <Subtitle>
          From where do you hail?
        </Subtitle>

        <Input name='city' label='City' />
        <Input name='state' label='State' />
      </Center>,
      <Center>
        <Title>
          GHIN Index
        </Title>

        <Subtitle>
          Could you share with us your GHIN Index / Estimated Handicap?
        </Subtitle>

        <Input name='ghin_index' type='number' label='GHIN Index' />
      </Center>,
      <Center>
        <Title>
          Tee-off Times
        </Title>

        <Subtitle>
          When do you prefer to play? (select all that apply)
        </Subtitle>

        <Caption style={{ fontWeight: 'bold' }}>Weekends</Caption>
        {Object.keys(timesOfDay)
          .map(key => <Input key={key} name={`weekends.${key}`} type='checkbox' label={timesOfDay[key]} />)}

        <Caption style={{ fontWeight: 'bold', marginTop: sizes.base }}>Weekdays</Caption>
        {Object.keys(timesOfDay)
          .map(key => <Input key={key} name={`weekdays.${key}`} type='checkbox' label={timesOfDay[key]} />)}
      </Center>,
      <Center>
        <Title>
          Tee Choice
        </Title>

        <Subtitle>
          From where do you swing? (select all that apply)
        </Subtitle>

        {Object.keys(teeChoices)
          .map(key => <Input key={key} name={`tee_choices.${key}`} type='checkbox' label={teeChoices[key]} />)}
      </Center>,
      <Center>
        <Title>
          Tee Choice
        </Title>

        <Subtitle>
          Do you like to play for money? (select all that apply)
        </Subtitle>

        {Object.keys(money)
          .map(key => <Input key={key} name={`money.${key}`} type='checkbox' label={money[key]} />)}

        <View style={{ marginBottom: sizes.base * 2 }} />

        <Subtitle>
          Do you drink on the golf course? (select all that apply)
        </Subtitle>

        {Object.keys(drinks)
          .map(key => <Input key={key} name={`drinks.${key}`} type='checkbox' label={drinks[key]} />)}
      </Center>,
      <Center>
        <Title>
          Methods of Play
        </Title>

        <Subtitle>
          What are your preferred methods of play? (select all that apply)
        </Subtitle>

        {Object.keys(methods)
          .map(key => <Input key={key} name={`methods.${key}`} type='checkbox' label={methods[key]} />)}
      </Center>,
      <Center>
        <Title>
          Tell Us a Bit More
        </Title>

        <Subtitle>
          Here, write down a little bit about yourself, on and off the gold course.
        </Subtitle>

        <Input name='bio' type='multiline' label='Bio' />
      </Center>,
      <Center>
        <Title>
          Terms and Privacy
        </Title>

        <Subtitle>
          By continuing you agree to our Terms of Use and Privacy Policy.
        </Subtitle>

        <Input disabled name='terms' label='Terms of Use' value={'Terms go here.'} />
        <Input disabled name='privacy' label='Privacy Policy' value={'Privacy Policy goes here.'} />
      </Center>,
    ]} />
  </Form>
}
