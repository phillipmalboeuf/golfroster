import firebase, { firestore } from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import { types, flow } from 'mobx-state-tree'

import { Club } from './club'
import { Event } from './event'

export const Player = types.model({
  id: types.maybe(types.identifier),
  email: types.maybe(types.string),
  first_name: types.maybe(types.string),
  accepted_terms: types.maybe(types.boolean),
  clubs: types.optional(types.array(Club), []),
  events: types.optional(types.array(Event), []),
})
  .actions(self => ({
    fetch: flow(function* fetch() {
      const snapshot: firestore.DocumentSnapshot = yield firebase.app().firestore().collection('players')
        .doc(self.id).get()
      const data = snapshot.data()

      Object.keys(data).forEach(key => self[key] = data[key])
    }),
    save: flow(function* save(data: firestore.DocumentData) {
      yield firebase.app().firestore().collection('players').doc(self.id).set(data, { merge: true })
      
      Object.keys(data).forEach(key => self[key] = data[key])
    }),
  }))
