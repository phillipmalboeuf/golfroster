import React, { FunctionComponent, useState, useContext } from 'react'
import { TouchableWithoutFeedback, Keyboard, Linking, Text } from 'react-native'
import { Paragraph } from 'react-native-paper'

import { StoreContext } from '../contexts/store'

import { Center, Padded } from './layouts'
import { Form } from './form'
import { Input } from './input'
import { Subheader, Underline } from './text'


export const ContactForm: FunctionComponent<{}> = () => {
  const { store: { player, sendFeedback } } = useContext(StoreContext)
  const [sent, setSent] = useState(false)
  return <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <Padded>
      <Subheader>
        Do let us know if you have any feedback, question, or comment to send our way.
      </Subheader>
      <Paragraph style={{ marginBottom: 20 }}>Fill out this form or write to us at <Underline onPress={() => Linking.openURL('mailto:jesse@golfroster.com')}>jesse@golfroster.com</Underline>.</Paragraph>

      {!sent
        ? <Form onSubmit={async values => {
          await sendFeedback(values.subject, values.body)
          setSent(true)
        }} cta={'Send'}>
          
          <Input label='Message subject' name='subject' />
          <Input type='multiline' label='Your feedback, question, or comment' name='body' />
        </Form>
      : <Text>Successfully sent, we'll get back to you shortly.</Text>}
    </Padded>
  </TouchableWithoutFeedback>
}