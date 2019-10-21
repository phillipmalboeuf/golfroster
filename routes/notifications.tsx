import React, { useContext } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'

import { Text } from 'react-native'
import { Button } from 'react-native-paper'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'


export const Notifications: FunctionComponent<{}> = props => {
  const { user, auth } = useContext(FirebaseContext)
  const { store } = useContext(StoreContext)

  return <>
    <Observer>{() => <Text>Notifications</Text>}</Observer>
  </>
}
