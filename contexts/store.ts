import firebase, { firestore } from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import { createContext } from 'react'
import { types, flow } from 'mobx-state-tree'

import { Player } from '../models/player'

const Store = types
  .model({
    player: types.maybe(Player),
  })
  .actions(self => ({

    login: flow(function* login(id: string) {
      self.player = Player.create({ id })
      self.player.fetch()
    }),
    exists: flow(function* exists(email: string) {
      return !(yield firebase.app().firestore().collection('players').where('email', '==', email).get()).empty
    }),

  }))

export const StoreContext = createContext({
  store: Store.create(),
})
