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



export const GetStarted: FunctionComponent<{}> = props => {
  const { user, auth } = useContext(FirebaseContext)
  const { store } = useContext(StoreContext)

  const [email, setEmail] = useState<string>(undefined)
  const [exists, setExists] = useState<boolean>(undefined)

  return <Dots path='getstarted' hideButtons items={[
    <Center>
      <Headline>
        GolfRoster
      </Headline>

      <Subheading>
        Organize ideal tee-offs with minimal effort
      </Subheading>

      <Link to='/getstarted/1'>
        <Button mode='contained' uppercase={false}>
          Get Started
        </Button>
      </Link>
    </Center>,
    <Center>
      <Headline>
        First Things First
      </Headline>

      <Subheading>
        Let’s connect by entering your email address or by logging in with your Facebook account.
      </Subheading>

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
        <Headline>
          Welcome Back!
        </Headline>
        <Subheading>
          Get back into your tee-off calendar by entering your password.
        </Subheading>

        <Form onSubmit={async values => {
          auth.signInWithEmailAndPassword(email, values.password)
        }} cta='Log me in'>
          <Input name='password' type='password' label='Your password' placeholder='********' />
        </Form>
      </Center>
      : <Center>
        <Headline>
          You're new here!
        </Headline>
        <Subheading>
          The first step to creating your account is to enter a new password here.
        </Subheading>

        <Form onSubmit={async values => {
          auth.createUserWithEmailAndPassword(email, values.password)
        }} cta='Sign me up'>
          <Input name='password' type='newpassword' label='New password' placeholder='********' />
        </Form>
      </Center>,
  ]} />
}
