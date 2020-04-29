import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { types, flow } from 'mobx-state-tree'

import { Club } from './club'
import { Event } from './event'

export const Player = types.model({
  id: types.maybe(types.identifier),
  email: types.maybe(types.string),
  first_name: types.maybe(types.string),
  last_name: types.maybe(types.string),
  bio: types.maybe(types.string),
  photo: types.maybe(types.string),
  city: types.maybe(types.string),
  state: types.maybe(types.string),
  ghin_index: types.maybe(types.number),
  weekends: types.array(types.string),
  weekdays: types.array(types.string),
  money: types.array(types.string),
  drinks: types.array(types.string),
  tee_choices: types.array(types.string),
  methods: types.array(types.string),
  accepted_terms: types.maybe(types.boolean),
  friends: types.array(types.string),
  clubs: types.array(types.string),
  pro: types.maybe(types.boolean),
})
  .actions(self => ({
    fetch: flow(function* fetch() {
      const snapshot: FirebaseFirestoreTypes.DocumentSnapshot = yield firestore().collection('players')
        .doc(self.id).get()
      const data = snapshot.data()

      Object.keys(data).forEach(key => self[key] = data[key])
    }),
    
    save: flow(function* save(data: any) {
      Object.keys(data).forEach(key => (data[key] === undefined) && delete data[key])
      yield firestore().collection('players').doc(self.id).set(data, { merge: true })

      Object.keys(data).forEach(key => self[key] = data[key])
    }),

    unfriend: flow(function* unfriend(friendId: string) {
      yield Promise.all([
        firestore().collection('players').doc(self.id).update({
          friends: firestore.FieldValue.arrayRemove(friendId),
        }),
        firestore().collection('players').doc(friendId).update({
          friends: firestore.FieldValue.arrayRemove(self.id),
        }),
      ])

      self.friends.splice(self.friends.indexOf(friendId))
    }),

    requestFriend: flow(function* requestFriend(friendId: string) {
      yield firestore().collection('players').doc(self.id).update({
        friends: firestore.FieldValue.arrayUnion(friendId),
      })

      self.friends.push(friendId)
    }),
  }))
