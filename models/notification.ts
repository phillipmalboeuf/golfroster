import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { types, flow, destroy } from 'mobx-state-tree'

import { dateType } from './event'

export const Notification = types.model({
  id: types.identifier,
  player_id: types.string,
  type: types.string,
  subject_id: types.string,
  subject_name: types.string,
  subject_date: types.maybe(dateType),
  sent_by_id: types.maybe(types.string),
  sent_by_name: types.maybe(types.string),
  date: dateType,
  seen: types.optional(types.boolean, false),
  accepted: types.optional(types.boolean, false),
})
  .actions(self => ({
    accept: flow(function* accept() {
      yield firestore().collection('players').doc(self.player_id)
        .collection('notifications').doc(self.id).update({ accepted: true })
    }),
    hide: flow(function* hide() {
      yield firestore().collection('players').doc(self.player_id)
        .collection('notifications').doc(self.id).delete()
        
      destroy(self)
    }),
    see: flow(function* see() {
      yield firestore().collection('players').doc(self.player_id)
        .collection('notifications').doc(self.id).update({ seen: true })
    }),
  }))
