import firebase, { firestore } from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import { types, flow } from 'mobx-state-tree'

import { dateType } from './event'

export const Message = types.model({
  chatroom_id: types.string,
  player_id: types.string,
  body: types.string,
  date: dateType,
  seen_by: types.array(types.string),
})
  .actions(self => ({
    send: flow(function* send() {
      yield firebase.app().firestore().collection('chatrooms').doc(self.chatroom_id)
        .collection('messages').add(self)
    }),
  }))
