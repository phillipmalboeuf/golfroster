import { createContext } from 'react'
import { firestore, auth, User } from 'firebase'

export const FirebaseContext = createContext({
  db: undefined as firestore.Firestore,
  auth: undefined as auth.Auth,
  user: undefined as User,
})
