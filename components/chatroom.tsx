import React, { useContext, Fragment } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'
import { SnapshotIn, SnapshotOrInstance, Instance } from 'mobx-state-tree'

import { Text, View } from 'react-native'
import { Button, Appbar, List, Headline, Caption, Chip } from 'react-native-paper'

import { StoreContext } from '../contexts/store'
import { Chatroom as ChatroomModel } from '../models/chatroom'

import { Center, Padded, Spaced } from '../components/layouts'
import { Avatar, Background } from '../components/photos'


export const Chatroom: FunctionComponent<{
  chatroom: Instance<typeof ChatroomModel>
}> = ({ chatroom }) => {
  const { store } = useContext(StoreContext)
  console.log(chatroom)

  return <Observer>
  {() => <>
    {Array.from(chatroom.messages.values()).map(message => <Fragment key={message.date.toISOString()}>
      <Chip>{message.body}</Chip>
    </Fragment>)}
  </>}</Observer>
}
