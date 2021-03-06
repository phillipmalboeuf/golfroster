import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { types, flow } from 'mobx-state-tree'
import { Player } from './player'


export const dateType = types.snapshotProcessor(types.Date, {
  preProcessor(d: FirebaseFirestoreTypes.Timestamp | Date) {
    return (d && (d as FirebaseFirestoreTypes.Timestamp).toDate)
      ? (d as FirebaseFirestoreTypes.Timestamp).toDate() : d as any as Date
  },
})

export const Event = types.model({
  id: types.optional(types.identifier, () => firestore().collection('events').doc().id),
  organizer_id: types.string,
  name: types.string,
  club: types.maybe(types.string),
  description: types.maybeNull(types.string),
  photo: types.maybe(types.string),
  start_date: dateType,
  end_date: types.maybe(dateType),
  repeatable: types.optional(types.boolean, false),
  members: types.array(types.string),
  money: types.array(types.string),
  drinks: types.array(types.string),
  tee_choices: types.array(types.string),
  methods: types.array(types.string),
})
  .actions(self => ({
    save: flow(function* save(data: any) {
      Object.keys(data).forEach(key => (data[key] === undefined) && delete data[key])
      yield firestore().collection('events').doc(self.id).set(data, { merge: true })
      
      Object.keys(data).forEach(key => self[key] = data[key])
    }),
    // tslint:disable-next-line: variable-name
    invite: flow(function* save(player_id: string, invited_by: string) {
      yield firestore().collection('events').doc(self.id)
        .collection('invitations').add({
          player_id,
          invited_by,
        })
    }),
  }))
