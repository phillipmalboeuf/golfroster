import { useContext, useState, useEffect } from 'react'
import { StoreContext } from '../contexts/store'

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
