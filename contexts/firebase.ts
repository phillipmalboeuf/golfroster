import { createContext } from 'react'
import { FirebaseAuthTypes } from '@react-native-firebase/auth'

export const FirebaseContext = createContext({
  user: undefined as FirebaseAuthTypes.User,
})
