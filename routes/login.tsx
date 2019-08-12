import React, { useContext } from 'react'
import { FunctionComponent } from 'react'

import { Text } from 'react-native'
import { Button } from 'react-native-paper'

import { FirebaseContext } from '../contexts/firebase'
import { Form } from '../components/form'
import { Input } from '../components/input'


export const Login: FunctionComponent<{}> = props => {
  const { user, auth } = useContext(FirebaseContext)

  return <>
    <Form onSubmit={async ({ email, password }) => {
      auth.signInWithEmailAndPassword(email, password)
    }} cta='Login'>
      <Input name='email' type='email' label='Email address' placeholder='player@golfroster.com' />
      <Input name='password' type='password' label='Password' placeholder='********' />
    </Form>
    
    <Form onSubmit={async ({ email, password }) => {
      auth.createUserWithEmailAndPassword(email, password)
    }} cta='Sign up'>
      <Input name='email' type='email' label='Email address' placeholder='player@golfroster.com' />
      <Input name='password' type='newpassword' label='New Password' placeholder='********' />
    </Form>
  </>
}
