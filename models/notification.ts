import firebase, { firestore } from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import { types, flow } from 'mobx-state-tree'

import { dateType } from './event'

export const Notification = types.model({
  id: types.identifier,
  invitation_type: types.string,
  invited_to_id: types.string,
  invited_to_name: types.string,
  invited_by_id: types.maybe(types.string),
  invited_by_name: types.maybe(types.string),
  date: dateType,
  seen: types.optional(types.boolean, false),
})
  .actions(self => ({
    // see: flow(function* see() {
      
    // }),
  }))
