import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import { types, flow } from 'mobx-state-tree'

import { Club } from './club'

export const Player = types
  .model({
    id: types.identifier,
    name: types.maybe(types.string),
    clubs: types.optional(types.array(Club), []),
  })
  .actions(self => ({
    fetch: flow(function* fetch() {
      const player = (yield firebase.app().firestore().collection('players').doc(self.id).get()).data()
      self.name = player.name
    }),
  }))
