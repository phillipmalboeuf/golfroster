import { useContext, useState, useEffect } from 'react'
import { StoreContext } from '../contexts/store'
import { Group as GroupModel } from '../models/group'
import { Instance } from 'mobx-state-tree'

export function usePlayer(id: string) {
  const { store } = useContext(StoreContext)
  const [player, setPlayer] = useState(store.friends.get(id))

  useEffect(() => {
    if (!player) {
      if (id === store.player.id) {
        setPlayer(store.player)
      } else {
        store.fetchPlayer(id)
          .then(() => setPlayer(store.players.get(id)))
      }
    }
  }, [])

  return player
}

export function usePlayerGroups(id: string) {
  const { store } = useContext(StoreContext)
  const [groups, setGroups] = useState<Instance<typeof GroupModel>[]>([])

  useEffect(() => {
    store.fetchPlayerGroups(id)
      .then(setGroups)

  }, [])

  return groups
}

export function useGroup(id: string) {
  const { store } = useContext(StoreContext)
  const [group, setGroup] = useState(store.groups.get(id))

  useEffect(() => {
    if (!group) {
      store.fetchGroup(id)
        .then(() => setGroup(store.groups.get(id)))
    }
  }, [])

  return group
}
