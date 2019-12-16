import firebase, { firestore } from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import { types, flow } from 'mobx-state-tree'
import { Player } from './player'

export const Group = types.model({
  id: types.optional(types.identifier, () => firebase.app().firestore().collection('groups').doc().id),
  organizer_id: types.string,
  name: types.string,
  description: types.maybeNull(types.string),
  photo: types.maybe(types.string),
  city: types.maybe(types.string),
  state: types.maybe(types.string),
  members: types.array(types.string),
  money: types.array(types.string),
  drinks: types.array(types.string),
  tee_choices: types.array(types.string),
  methods: types.array(types.string),
  is_public: types.optional(types.boolean, false),
})
  .actions(self => ({
    fetch: flow(function* fetch() {
      const snapshot: firestore.DocumentSnapshot = yield firebase.app().firestore().collection('groups')
        .doc(self.id).get()
      const data = snapshot.data()

      Object.keys(data).forEach(key => self[key] = data[key])
    }),
    save: flow(function* save(data: firestore.DocumentData) {
      Object.keys(data).forEach(key => (data[key] === undefined) && delete data[key])
      yield firebase.app().firestore().collection('groups').doc(self.id).set(data, { merge: true })
      
      Object.keys(data).forEach(key => self[key] = data[key])
    }),
    // tslint:disable-next-line: variable-name
    invite: flow(function* save(player_id: string, invited_by: string) {
      yield firebase.app().firestore().collection('groups').doc(self.id)
        .collection('invitations').add({
          player_id,
          invited_by,
        })
    }),
  }))
