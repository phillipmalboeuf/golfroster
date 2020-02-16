import React, { useContext, Fragment, useRef, useEffect } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'
import { SnapshotIn, SnapshotOrInstance, Instance } from 'mobx-state-tree'

import { Text, View, ScrollView, KeyboardAvoidingView } from 'react-native'
import { Appbar, List, Headline, Caption, Chip, Surface, Portal } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment'

import { StoreContext } from '../contexts/store'
import { StylesContext } from '../contexts/styles'
import { Chatroom as ChatroomModel } from '../models/chatroom'

import { Center, Padded, Spaced, Bottom } from '../components/layouts'
import { Avatar, Background } from '../components/photos'
import { Form } from './form'
import { Input } from './input'


export const Chatroom: FunctionComponent<{
  chatroom: Instance<typeof ChatroomModel>
}> = ({ chatroom }) => {
  const { store } = useContext(StoreContext)
  const { colors } = useContext(StylesContext)
  const scrollView = useRef<ScrollView>()
  const form = useRef<Form>()

  return <>
  <ScrollView ref={scrollView} onLayout={e => scrollView.current.scrollToEnd({ animated: false })}>
    <Padded tight>
      <Observer>
      {() => {
        const messages = Array.from(chatroom.messages.values()).sort((a, b) => a.date.getTime() - b.date.getTime())
        return <>
          {messages.map((message, index) => <Fragment key={message.date.toISOString()}>
            <View style={{
              flexDirection: message.player_id === store.player.id ? 'row-reverse' : 'row',
              flexWrap: 'wrap',
              marginTop: 2,
            }}>
              <Chip {...message.player_id === store.player.id ? {
                style: {
                  backgroundColor: colors.green,
                  borderBottomRightRadius: 3,
                  ...(messages[index - 1] && messages[index - 1].player_id === message.player_id) && {
                    borderTopRightRadius: 3,
                  },
                },
                textStyle: { color: 'white' },
              } : {
                style: {
                  borderBottomLeftRadius: 3,
                  ...(messages[index - 1] && messages[index - 1].player_id === message.player_id) && {
                    borderTopLeftRadius: 3,
                  },
                },
              }}>{message.body}</Chip>
            </View>

            {(!messages[index + 1]
            || messages[index + 1].player_id !== message.player_id
            || messages[index + 1].date.getTime() > message.date.getTime() + 600000)
              && <Caption style={{
                textAlign: message.player_id === store.player.id ? 'right' : 'left',
              }}>{moment(message.date).fromNow()}</Caption>}
          </Fragment>)}
        </>
      }}
      </Observer>
    </Padded>
  </ScrollView>
  
  <Portal>
    <KeyboardAvoidingView behavior='position' enabled style={{
      height: 100,
      width: '100%',
      position: 'absolute',
      left: 0,
      bottom: 0,
    }} contentContainerStyle={{
      padding: 10,
        backgroundColor: 'white',
    }} keyboardVerticalOffset={-30}>
      <Form ref={form} onSubmit={async values => {
        if (values.body) {
          await chatroom.sendMessage(values.body, store.player.id)
        }
        form.current.reset()
      }}
        inline cta={<Icon name='send' size={33} />}>
        <Input name='body' placeholder='Message here...' flat />
      </Form>
    </KeyboardAvoidingView>
  </Portal>
  </>
}
