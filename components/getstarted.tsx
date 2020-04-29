import React, { useContext, useRef, useState } from 'react'
import { FunctionComponent } from 'react'

import { View, Text, Dimensions, Image } from 'react-native'
import { Link, Redirect } from 'react-router-native'

import auth from '@react-native-firebase/auth'

import fb from 'react-native-fbsdk'

import { StoreContext } from '../contexts/store'

import { Form } from './form'
import { Input } from './input'
import { Center, Padded } from './layouts'
import { Dots } from './dots'
import { Title, Subtitle } from './text'
import { Button } from './button'


export const GetStarted: FunctionComponent<{}> = props => {
  const { store } = useContext(StoreContext)

  const [email, setEmail] = useState<string>(undefined)
  const [exists, setExists] = useState<boolean>(undefined)

  return <Dots path='getstarted' hideButtons items={[
    <Center>
      <View style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <Image style={{ width: 66, height: 66 }} source={require('../icon-ios.png')} />
      </View>
      
      <Title>
        GolfRoster
      </Title>

      <Subtitle>
        Organize ideal tee-offs and connect with likeminded players with minimal effort
      </Subtitle>

      <Link to='/getstarted/1'>
        <Button contained>
          Get Started
        </Button>
      </Link>
    </Center>,
    <Center>
      <Title>
        Sign In
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

      <Padded tight><Text style={{ textAlign: 'center' }}>– or –</Text></Padded>
      <Button contained facebook
          onPress={async () => {
            const result = await fb.LoginManager.logInWithPermissions(['email', 'public_profile'])
            
            if (!result.isCancelled) {
              const token = await fb.AccessToken.getCurrentAccessToken()
              const credential = auth.FacebookAuthProvider.credential(token.accessToken)
              await auth().signInWithCredential(credential)
            }
          }}>Continue with Facebook</Button>

      {exists !== undefined && <Redirect to='/getstarted/2' />}
    </Center>,
    exists
      ? <Center>
        <Title>
          Welcome Back!
        </Title>
        <Subtitle>
          Get back into your GolfRoster account by entering your password.
        </Subtitle>

        <Form onSubmit={async values => {
          await auth().signInWithEmailAndPassword(email, values.password)
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
          await auth().createUserWithEmailAndPassword(email, values.password)
        }} cta='Sign me up'>
          <Input name='password' type='newpassword' label='New password' placeholder='********' />
        </Form>
      </Center>,
  ]} />
}
