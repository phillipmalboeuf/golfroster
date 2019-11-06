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
  members: types.array(types.string),
  is_public: types.boolean,
})
  .actions(self => ({
    save: flow(function* save(data: firestore.DocumentData) {
      yield firebase.app().firestore().collection('groups').doc(self.id).set(data, { merge: true })
      
      Object.keys(data).forEach(key => self[key] = data[key])
    }),
  }))
