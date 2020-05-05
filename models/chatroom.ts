import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

import { types, flow } from 'mobx-state-tree'

import { Message } from './message'
import { dateType } from './event'

export const Chatroom = types.model({
  id: types.optional(types.identifier, () => firestore().collection('events').doc().id),
  players: types.array(types.string),
  event_id: types.maybeNull(types.string),
  group_id: types.maybeNull(types.string),
  messages: types.map(Message),
  latest: types.maybe(types.model({
    player_id: types.string,
    body: types.string,
    date: dateType,
  })),
})
  .actions(self => ({
    create: flow(function* create() {
      delete self.messages
      delete self.latest
      yield firestore().collection('chatrooms').doc(self.id).set(self)

      return self
    }),

    listMessages: flow(function* listChatrooms() {

      firestore().collection('chatrooms').doc(self.id).collection('messages')
        .onSnapshot(snapshot => {
          snapshot.docs.forEach(doc => {
            self.messages.set(doc.id, {
              chatroom_id: self.id,
              ...doc.data(),
            })
          })
        })

    }),
    
    sendMessage: flow(function* sendMessage(body: string, player: string) {

      const message = Message.create({
        chatroom_id: self.id,
        player_id: player,
        body,
        date: new Date(),
      })

      return yield message.send()
    }),
  }))
