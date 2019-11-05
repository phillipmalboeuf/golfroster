import React, { useContext, Fragment, useRef, useEffect } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'
import { SnapshotIn, SnapshotOrInstance, Instance } from 'mobx-state-tree'

import { Text, View, ScrollView } from 'react-native'
import { Button, Appbar, List, Headline, Caption, Chip, Surface } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import moment from 'moment'

import { StoreContext } from '../contexts/store'
import { Chatroom as ChatroomModel } from '../models/chatroom'

import { Center, Padded, Spaced, Bottom } from '../components/layouts'
import { Avatar, Background } from '../components/photos'
import { Form } from './form'
import { Input } from './input'


export const Chatroom: FunctionComponent<{
  chatroom: Instance<typeof ChatroomModel>
}> = ({ chatroom }) => {
  const { store } = useContext(StoreContext)
  const scrollView = useRef<ScrollView>()

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
                  backgroundColor: '#007251',
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
  <Bottom>
    <Form onSubmit={async values => {
      await chatroom.sendMessage(values.body, store.player.id)
    }}
      inline cta={<Icon name='send' size={33} />}>
      <Input name='body' placeholder='Message here...' flat />
    </Form>
  </Bottom>
  </>
}
