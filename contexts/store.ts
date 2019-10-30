import firebase, { firestore } from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import { createContext } from 'react'
import { types, flow } from 'mobx-state-tree'

import { Player } from '../models/player'
import { Event } from '../models/event'

const Store = types
  .model({
    player: types.maybe(Player),
    events: types.optional(types.map(Event), {}),
    friends: types.optional(types.map(Player), {}),
  })
  .actions(self => ({

    login: flow(function* login(id: string) {
      self.player = Player.create({ id })
      yield self.player.fetch()
    }),

    exists: flow(function* exists(email: string) {
      const snapshot: firestore.QuerySnapshot = yield firebase.app().firestore().collection('players').where('email', '==', email).get()
      return !snapshot.empty
    }),

    listEvents: flow(function* listEvents() {
      const snapshot: firestore.QuerySnapshot = yield firebase.app().firestore().collection('events').where('attendees', 'array-contains', self.player.id).get()
      snapshot.forEach(doc => self.events.set(doc.id, doc.data()))
    }),

    listFriends: flow(function* listFriends() {
      const snapshot: firestore.DocumentSnapshot[] = yield Promise.all(self.player.friends.map(friend => 
        firebase.app().firestore().collection('players').doc(friend).get()
      ))
      
      snapshot.forEach(doc => self.friends.set(doc.id, {
        id: doc.id,
        ...doc.data(),
      }))
      console.log(self.friends)
    }),

    createEvent: flow(function* exists(data: typeof Event.CreationType) {
      const event = Event.create({
        ...data,
        organizer_id: self.player.id,
        attendees: [self.player.id],
      })
      yield event.save(event)
      self.events.set(event.id, event)
    }),
    
  }))

export const StoreContext = createContext({
  store: Store.create(),
})
