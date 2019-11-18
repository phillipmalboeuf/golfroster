import firebase, { firestore } from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import { types, flow, destroy } from 'mobx-state-tree'

import { dateType } from './event'

export const Notification = types.model({
  id: types.identifier,
  player_id: types.string,
  invitation_type: types.string,
  invited_to_id: types.string,
  invited_to_name: types.string,
  invited_by_id: types.maybe(types.string),
  invited_by_name: types.maybe(types.string),
  date: dateType,
  seen: types.optional(types.boolean, false),
  accepted: types.optional(types.boolean, false),
})
  .actions(self => ({
    // see: flow(function* see() {
      
    // }),
    accept: flow(function* hide() {
      yield firebase.app().firestore().collection('players').doc(self.player_id)
        .collection('notifications').doc(self.id).update({ accepted: true })
    }),
    hide: flow(function* hide() {
      yield firebase.app().firestore().collection('players').doc(self.player_id)
        .collection('notifications').doc(self.id).delete()
        
      destroy(self)
    }),
  }))
