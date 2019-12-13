import React, { useContext, useRef, useState } from 'react'
import { FunctionComponent } from 'react'

import { View, Text, Dimensions } from 'react-native'
import { Button, Headline, Subheading } from 'react-native-paper'
import { Link, Redirect } from 'react-router-native'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'

import { Form } from './form'
import { Input } from './input'
import { Center } from './layouts'
import { Dots } from './dots'
import { Title, Subtitle } from './text'


export const GetStarted: FunctionComponent<{}> = props => {
  const { user, auth } = useContext(FirebaseContext)
  const { store } = useContext(StoreContext)

  const [email, setEmail] = useState<string>(undefined)
  const [exists, setExists] = useState<boolean>(undefined)

  return <Dots path='getstarted' hideButtons items={[
    <Center>
      <Title>
        GolfRoster
      </Title>

      <Subtitle>
        Organize ideal tee-offs with minimal effort
      </Subtitle>

      <Link to='/getstarted/1'>
        <Button mode='contained' uppercase={false}>
          Get Started
        </Button>
      </Link>
    </Center>,
    <Center>
      <Title>
        First Things First
      </Title>

      <Subtitle>
        Let’s connect by entering your email address or by logging in with your Facebook account.
      </Subtitle>

      <Form onSubmit={async values => {
        setExists(await store.exists(values.email))
        setEmail(values.email)
      }} cta='Continue with Email'>
        <Input name='email' type='email' label='Email address' placeholder='player@golfroster.com' autoFocus={false} />
      </Form>

      {exists !== undefined && <Redirect to='/getstarted/2' />}
    </Center>,
    exists
      ? <Center>
        <Title>
          Welcome Back!
        </Title>
        <Subtitle>
          Get back into your tee-off calendar by entering your password.
        </Subtitle>

        <Form onSubmit={async values => {
          await auth.signInWithEmailAndPassword(email, values.password)
        }} cta='Log me in'>
          <Input name='password' type='password' label='Your password' placeholder='********' />
        </Form>
      </Center>
      : <Center>
        <Title>
          You're new here!
        </Title>
        <Subtitle>
          The first step to creating your account is to enter a new password here.
        </Subtitle>

        <Form onSubmit={async values => {
          auth.createUserWithEmailAndPassword(email, values.password)
        }} cta='Sign me up'>
          <Input name='password' type='newpassword' label='New password' placeholder='********' />
        </Form>
      </Center>,
  ]} />
}
