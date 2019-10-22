import React, { useContext } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'

import { Text, View } from 'react-native'
import { Button, Appbar } from 'react-native-paper'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'
import { Calendar, Agenda } from 'react-native-calendars'


export const Events: FunctionComponent<{}> = props => {
  const { user, auth } = useContext(FirebaseContext)
  const { store } = useContext(StoreContext)

  return <>
    <Appbar.Header>
      <Appbar.Content title='Upcoming Events' />
      <Appbar.Action icon='magnify' />
      <Appbar.Action icon='dots-vertical' />
    </Appbar.Header>
    <Observer>{() => <View>
      <Calendar />
      {/* <Agenda<{ text: string }> items={{'2012-05-22': [{text: 'item 1 - any js object'}],
    '2012-05-23': [{text: 'item 2 - any js object'}],
    '2012-05-24': [],
    '2012-05-25': [{text: 'item 3 - any js object'}, {text: 'any js object'}]}}
        renderEmptyDate={() => <View>-</View>}
        renderItem={(item, firstItemInDay) => <View><Text>{item.text}</Text></View>}
        renderDay={(day, item) => <View />}
        rowHasChanged={(r1, r2) => r1.text !== r2.text} /> */}
    </View>}</Observer>
  </>
}
