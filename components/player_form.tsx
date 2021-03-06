import React, { useContext, useRef, useState } from 'react'
import { FunctionComponent } from 'react'

import { View, Text, Dimensions } from 'react-native'
import { Headline, Subheading, Caption, DataTable } from 'react-native-paper'
import { Link, Redirect } from 'react-router-native'
import { Observer } from 'mobx-react'

import { StoreContext } from '../contexts/store'
import { StylesContext } from '../contexts/styles'

import { Form, FormContext } from './form'
import { Input } from './input'
import { Center, Padded, Bottom } from './layouts'
import { Dots } from './dots'
import { Title, Subtitle } from './text'
import { Button } from './button'
import { Avatar, Upload } from './photos'
import { ClubsTable } from './clubs_table'
import { terms, privacy, disclaimer } from '../helpers/terms'

export const timesOfDay = {
  early_morning: 'Early morning',
  mid_morning: 'Mid-morning',
  afternoon: 'Afternoon',
  twilight: 'Twilight',
}

export const teeChoices = {
  ladies: 'Ladies / seniors (5,600 yds or less)',
  seniors: 'Men\'s Average (5,600 – 6,100 yds)',
  men: 'Men\'s advanced (6,100 - 6,600 yds)',
  championship: 'Tournament tees (6,600 - 7,000 yds)',
  tiger: 'Tiger Tees (7,000 yds or more)',
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

export const states = {
  AL: 'Alabama',
  AK: 'Alaska',
  AS: 'American Samoa',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  DC: 'District Of Columbia',
  FM: 'Federated States Of Micronesia',
  FL: 'Florida',
  GA: 'Georgia',
  GU: 'Guam',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MH: 'Marshall Islands',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  MP: 'Northern Mariana Islands',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PW: 'Palau',
  PA: 'Pennsylvania',
  PR: 'Puerto Rico',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VI: 'Virgin Islands',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
}


export const PlayerForm: FunctionComponent<{
  onSubmit: () => void
  onCancel: () => void
}> = props => {
  const { store } = useContext(StoreContext)
  const { sizes } = useContext(StylesContext)
  const form = useRef<Form>(undefined)

  return <Observer>{() => store.player.clubs.length ? <Form ref={form} hideButton
    values={store.player}
    onSubmit={async values => {
      store.player.save({
        ...values,
        weekends: values.weekends
          && Object.keys(values.weekends).filter(key => values.weekends[key] === true),
        weekdays: values.weekends
          && Object.keys(values.weekends).filter(key => values.weekends[key] === true),
        tee_choices: values.tee_choices
          && Object.keys(values.tee_choices).filter(key => values.tee_choices[key] === true),
        money: values.money
          && Object.keys(values.money).filter(key => values.money[key] === true),
        drinks: values.drinks
          && Object.keys(values.drinks).filter(key => values.drinks[key] === true),
        methods: values.methods
          && Object.keys(values.methods).filter(key => values.methods[key] === true),
        accepted_terms: true,
      })
      
      props.onSubmit()
    }}>
    <Dots path='profile_buildup' onFinish={() => {
      form.current.submit()
    }} onCancel={props.onCancel} items={[
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
          Where are you based?
        </Subtitle>

        <Input name='city' label='City' />
        <Input name='state' label='State' type='picker' options={Object.keys(states).map(state => ({
          value: state,
          label: states[state],
        }))} />
      </Center>,
      <Center>
        <Title>
          GHIN Index
        </Title>

        <Subtitle>
          Could you share with us your GHIN Index / Estimated Handicap?
        </Subtitle>

        <Input name='ghin_index' type='slider' label='GHIN Index' min={-5.0} max={50} />
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
          From where do you play? (select all that apply)
        </Subtitle>

        {Object.keys(teeChoices)
          .map(key => <Input key={key} name={`tee_choices.${key}`} type='checkbox' label={teeChoices[key]} />)}
      </Center>,
      <Center>
        <Title>
          Socializing
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
          Here, write down a little bit about yourself, on and off the golf course.
        </Subtitle>

        <Input name='bio' type='multiline' label='Bio' />
      </Center>,
      <Center>
        <Title>
          Pick a Profile Photo
        </Title>

        <Subtitle>
          Ideally, pick one of you on the course.
        </Subtitle>

        <FormContext.Consumer>
          {context => <Upload avatar onUpload={url => {
            context.onChange('photo', url)
          }} />}
        </FormContext.Consumer>
      </Center>,
      store.player.accepted_terms && <Center>
        <Title>
          Terms and Privacy
        </Title>

        <Subtitle>
          By continuing you agree to our Terms of Use and Privacy Policy.
        </Subtitle>

        <Input disabled type='multiline' name='terms' label='Terms of Use' value={terms} />
        <Input disabled type='multiline' name='privacy' label='Privacy Policy' value={privacy} />
        <Input disabled type='multiline' name='disclaimer' label='Disclaimer' value={disclaimer} />
      </Center>,
    ].filter(element => element as any as boolean !== false)} />
  </Form> : <Form ref={form} hideButton onSubmit={async values => {
    store.player.save({
      clubs: Object.keys(values.clubs).filter(key => values.clubs[key] === true),
    })
  }}>
    <Center>
      <Padded>
        <Title>
          Going to the Club
        </Title>

        <Subtitle>
          Now, could you find from this list the clubs to which you are a member or where you play?
        </Subtitle>
      </Padded>
      
      <ClubsTable />
    </Center>

    <Bottom>
      <Button contained onPress={() => form.current.submit()}>Continue with this selection</Button>
    </Bottom>
  </Form>}</Observer>
}
