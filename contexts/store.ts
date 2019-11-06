import firebase, { firestore } from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import { createContext } from 'react'
import { types, flow, unprotect } from 'mobx-state-tree'

import { Player } from '../models/player'
import { Event } from '../models/event'
import { Group } from '../models/group'
import { Chatroom } from '../models/chatroom'

const Store = types
  .model({
    player: types.maybe(Player),
    events: types.optional(types.map(Event), {}),
    friends: types.optional(types.map(Player), {}),
    players: types.optional(types.map(Player), {}),
    groups: types.optional(types.map(Group), {}),
    chatrooms: types.optional(types.map(Chatroom), {}),
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
      firebase.app().firestore().collection('events')
        .where('attendees', 'array-contains', self.player.id).onSnapshot(snapshot => {
          snapshot.forEach(doc => self.events.set(doc.id, doc.data()))
        })
    }),

    createEvent: flow(function* exists(data: typeof Event.CreationType) {
      const event = Event.create({
        ...data,
        organizer_id: self.player.id,
        attendees: [self.player.id],
      })
      yield event.save(event)
      // self.events.set(event.id, event)
    }),

    fetchPlayer: flow(function* fetchPlayer(id: string) {
      const player = Player.create({ id })
      self.players.set(id, player)
      yield player.fetch()
    }),

    listFriends: flow(function* listFriends() {

      firebase.app().firestore().collection('players')
        .where('friends', 'array-contains', self.player.id)
        .where(firestore.FieldPath.documentId(), 'in', self.player.friends)
        .onSnapshot(snapshot => {
        snapshot.docs.forEach(doc => self.friends.set(doc.id, {
          id: doc.id,
          ...doc.data(),
        }))
      })

    }),

    listChatrooms: flow(function* listChatrooms() {

      firebase.app().firestore().collection('chatrooms').where('players', 'array-contains', self.player.id)
        .onSnapshot(snapshot => {
          snapshot.docs.forEach(doc => {
            self.chatrooms.set(doc.id, {
              id: doc.id,
              ...doc.data(),
            })

            self.chatrooms.get(doc.id).listMessages()
          })
        })

    }),

    listGroups: flow(function* listGroups() {

      firebase.app().firestore().collection('groups').where('members', 'array-contains', self.player.id)
        .onSnapshot(snapshot => {
          snapshot.docs.forEach(doc => {
            self.groups.set(doc.id, {
              id: doc.id,
              ...doc.data(),
            })
          })
        })

    }),

    createGroup: flow(function* exists(data: typeof Group.CreationType) {
      const group = Group.create({
        ...data,
        organizer_id: self.player.id,
        members: [self.player.id],
      })
      yield group.save(group)
    }),
    
  }))

const store = Store.create()
unprotect(store)
export const StoreContext = createContext({ store })
