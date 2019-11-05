import firebase, { firestore } from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import { types, flow } from 'mobx-state-tree'

import { Message } from './message'
import { dateType } from './event'

export const Chatroom = types.model({
  id: types.optional(types.identifier, () => firebase.app().firestore().collection('events').doc().id),
  players: types.array(types.string),
  event_id: types.maybe(types.string),
  group_id: types.maybe(types.string),
  messages: types.optional(types.map(Message), {}),
  latest: types.maybe(types.model({
    player_id: types.string,
    body: types.string,
    date: dateType,
  })),
})
  .actions(self => ({

    listMessages: flow(function* listChatrooms() {

      firebase.app().firestore().collection('chatrooms').doc(self.id).collection('messages')
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
