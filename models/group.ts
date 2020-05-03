import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { types, flow } from 'mobx-state-tree'
import { Player } from './player'

export const Group = types.model({
  id: types.optional(types.identifier, () => firestore().collection('groups').doc().id),
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
      const snapshot: FirebaseFirestoreTypes.DocumentSnapshot = yield firestore().collection('groups')
        .doc(self.id).get()
      const data = snapshot.data()

      Object.keys(data).forEach(key => self[key] = data[key])
    }),
    save: flow(function* save(data: any) {
      Object.keys(data).forEach(key => (data[key] === undefined) && delete data[key])
      yield firestore().collection('groups').doc(self.id).update(data)
      
      Object.keys(data).forEach(key => self[key] = data[key])
    }),
    // tslint:disable-next-line: variable-name
    invite: flow(function* save(player_id: string, invited_by: string) {
      yield firestore().collection('groups').doc(self.id)
        .collection('invitations').add({
          player_id,
          invited_by,
        })
    }),
  }))
