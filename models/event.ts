import firebase, { firestore } from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import { types, flow } from 'mobx-state-tree'
import { Player } from './player'


const dateType = types.snapshotProcessor(types.Date, {
  preProcessor(d: firestore.Timestamp) { return d.toDate ? d.toDate() : d as any as Date },
})

export const Event = types.model({
  id: types.optional(types.identifier, () => firebase.app().firestore().collection('events').doc().id),
  organizer_id: types.string,
  name: types.string,
  description: types.maybeNull(types.string),
  start_date: dateType,
  end_date: dateType,
  repeatable: types.optional(types.boolean, false),
  attendees: types.array(types.string),
})
  .actions(self => ({
    save: flow(function* save(data: firestore.DocumentData) {
      yield firebase.app().firestore().collection('events').doc(self.id).set(data, { merge: true })
      
      Object.keys(data).forEach(key => self[key] = data[key])
    }),
  }))
