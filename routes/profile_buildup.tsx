import React, { useContext, useRef, useState } from 'react'
import { FunctionComponent } from 'react'

import { View, Text, Dimensions } from 'react-native'
import { Button, Title, Headline, Subheading } from 'react-native-paper'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'

import { Form } from '../components/form'
import { Input } from '../components/input'
import { Center } from '../components/layouts'
import { Dots } from '../components/dots'
import { Link, Redirect } from 'react-router-native'



export const ProfileBuildup: FunctionComponent<{}> = props => {
  const { store } = useContext(StoreContext)
  const form = useRef<Form>(undefined)

  return <Form ref={form} hideButton onSubmit={async values => {
    store.player.save({
      ...values,
      accepted_terms: true,
    })
  }} cta='Continue with Email'>
    <Dots path='profile_buildup' onFinish={() => {
      form.current.submit()
    }} items={[
      <Center>
        <Headline>
          Let’s Get to Know You
        </Headline>

        <Subheading>
          How would you like to be addressed?
        </Subheading>

        <Input name='first_name' label='First Name' />
        <Input name='last_name' label='Last Name' />
      </Center>,
      <Center>
        <Headline>
          Terms and Privacy
        </Headline>
      </Center>,
    ]} />
  </Form>
}
