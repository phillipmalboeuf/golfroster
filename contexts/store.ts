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

  }))

export const StoreContext = createContext({
  store: Store.create(),
})
