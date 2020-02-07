import firebase, { firestore } from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import { createContext } from 'react'
import { AsyncStorage } from 'react-native'
import { types, flow, unprotect, onSnapshot, applySnapshot, Instance, castFlowReturn } from 'mobx-state-tree'

import { Player } from '../models/player'
import { Event as EventModel } from '../models/event'
import { Group } from '../models/group'
import { Chatroom } from '../models/chatroom'
import { Notification } from '../models/notification'

const key = 'store'

const Store = types
  .model({
    player: types.maybe(Player),
    events: types.map(EventModel),
    friends: types.map(Player),
    players: types.map(Player),
    groups: types.map(Group),
    chatrooms: types.map(Chatroom),
    notifications: types.map(Notification),
    badges: types.model({
      chatrooms: types.maybe(types.number),
      notifications: types.maybe(types.number),
    }),
    lookingForPlayers: types.optional(types.boolean, true),
  })
  .views(self => ({
    eventDates(): {[key: string]: Array<Instance<typeof EventModel>>} {
      return Array.from(self.events.values()).reduce((dates, event) => {
        const start = event.start_date.toISOString().split('T')[0]
        // const end = event.end_date.toISOString().split('T')[0]

        if (!dates[start]) { dates[start] = [] }
        dates[start].push(event)
        
        // if (!dates[start]) { dates[start] = { starts: [], ends: [] } }
        // if (!dates[end]) { dates[end] = { starts: [], ends: [] } }

        // dates[start].starts.push(event)
        // dates[end].ends.push(event)

        return dates
      }, {})
    },
  }))
  .actions(self => ({

    login: flow(function* login(id: string) {
      const waitForPlayer = new Promise((resolve, reject) => {
        const unsubscribe = firebase.app().firestore().collection('players').doc(id)
          .onSnapshot({
            next: doc => {
              if (doc.data()) {
                unsubscribe()
                resolve(doc.data())
              }
            },
            error: error => {
              unsubscribe()
              reject(error)
            },
          })
      })
      const data: firestore.DocumentSnapshot = yield waitForPlayer
      self.player = Player.create({ id, ...data })
    }),

    logout: flow(function* logout() {
      yield firebase.app().auth().signOut()
      applySnapshot(self, { badges: {} })
    }),

    exists: flow(function* exists(email: string) {
      const snapshot: firestore.QuerySnapshot = yield firebase.app().firestore().collection('players').where('email', '==', email).get()
      return !snapshot.empty
    }),

    listEvents: flow(function* listEvents() {
      firebase.app().firestore().collection('events')
        .where('attendees', 'array-contains', self.player.id).onSnapshot(snapshot => {
          setDocs(snapshot, self.events)
        })
    }),

    createEvent: flow(function* createEvent(data: typeof EventModel.CreationType) {
      const event = EventModel.create({
        ...data,
        organizer_id: self.player.id,
        attendees: [self.player.id],
      })
      yield event.save(event)
      return event
    }),

    attendEvent: flow(function* exists(eventId: string) {
      yield firebase.app().firestore().collection('events').doc(eventId).update({
        attendees: firestore.FieldValue.arrayUnion(self.player.id),
      })
    }),

    fetchPlayer: flow(function* fetchPlayer(id: string) {
      const player = Player.create({ id })
      self.players.set(id, player)
      yield player.fetch()
    }),

    listFriends: flow(function* listFriends() {

      firebase.app().firestore().collection('players')
        .where('friends', 'array-contains', self.player.id)
        // .where(firestore.FieldPath.documentId(), 'in', self.player.friends)
        .onSnapshot(snapshot => {
          setDocs(snapshot, self.friends, undefined, change => self.player.friends.includes(change.doc.id))
        })

    }),

    createChatroom: flow(function* createChatroom(data: typeof Chatroom.CreationType) {
      const chatroom = Chatroom.create({
        ...data,
        players: [...data.players, self.player.id],
      })
      return yield chatroom.create()
    }),

    listChatrooms: flow(function* listChatrooms() {

      firebase.app().firestore().collection('chatrooms').where('players', 'array-contains', self.player.id)
        .onSnapshot(snapshot => {
          setDocs(snapshot, self.chatrooms)

          snapshot.docs.forEach(doc => {
            self.chatrooms.get(doc.id).listMessages()
          })
        })

    }),

    listGroups: flow(function* listGroups() {

      firebase.app().firestore().collection('groups').where('members', 'array-contains', self.player.id)
        .onSnapshot(snapshot => {
          setDocs(snapshot, self.groups)
        })

    }),

    fetchGroup: flow(function* fetchGroup(id: string) {
      const group = Group.create({ id })
      self.groups.set(id, group)
      yield group.fetch()
    }),

    createGroup: flow(function* exists(data: typeof Group.CreationType) {
      const group = Group.create({
        ...data,
        organizer_id: self.player.id,
        members: [self.player.id],
      })
      yield group.save(group)
      return group
    }),

    joinGroup: flow(function* exists(groupId: string) {
      yield firebase.app().firestore().collection('groups').doc(groupId).update({
        members: firestore.FieldValue.arrayUnion(self.player.id),
      })
    }),

    listNotifications: flow(function* listNotifications() {

      firebase.app().firestore().collection('players').doc(self.player.id)
        .collection('notifications')
        .onSnapshot(snapshot => {
          setDocs(snapshot, self.notifications, { player_id: self.player.id })

          self.badges.notifications = snapshot.docs.filter(doc => !doc.data().seen).length
        })

    }),

    stopLookingForPlayers: () => {
      self.lookingForPlayers = false
    },
    
  }))

const store = Store.create({ badges: {} })
unprotect(store)

onSnapshot(store, snapshot => {
  AsyncStorage.setItem(key, JSON.stringify(snapshot))
})

AsyncStorage.getItem(key).then(stored => {
  if (stored) {
    applySnapshot(store, JSON.parse(stored))
  }
})

export const StoreContext = createContext({ store })

const setDocs = (
  snapshot: firestore.QuerySnapshot,
  storeMap: Map<string, any>,
  more?: {},
  filter?: (change: firestore.DocumentChange) => boolean
) => {
  return snapshot.docChanges().filter(change => filter ? filter(change) : true).forEach(change => {
    if (change.type === 'removed') {
      storeMap.delete(change.doc.id)
    } else {
      storeMap.set(change.doc.id, {
        id: change.doc.id,
        ...change.doc.data(),
        ...more,
      })
    }
  })
}
