import { createContext } from 'react'
import { firestore, auth, User, storage } from 'firebase'

export const FirebaseContext = createContext({
  db: undefined as firestore.Firestore,
  auth: undefined as auth.Auth,
  user: undefined as User,
  storage: undefined as storage.Storage,
})
