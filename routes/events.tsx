import React, { useContext, useState, useRef } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'

import { Text, View } from 'react-native'
import { Button, Appbar } from 'react-native-paper'
import { Calendar, Agenda } from 'react-native-calendars'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { FirebaseContext } from '../contexts/firebase'
import { StoreContext } from '../contexts/store'

import { Full, Center } from '../components/layouts'
import { Dots } from '../components/dots'
import { Form } from '../components/form'
import { Input } from '../components/input'
import { Title, Subtitle } from '../components/text'
import { FloatingButton } from '../components/button'


export const Events: FunctionComponent<{}> = props => {
  // const { user, auth } = useContext(FirebaseContext)
  const { store } = useContext(StoreContext)

  const form = useRef<Form>()
  const [building, setBuilding] = useState(false)

  return <>
    <Appbar.Header>
      <Appbar.Content title='Upcoming Events' />
      <Appbar.Action icon='magnify' />
      <Appbar.Action icon='dots-vertical' />
    </Appbar.Header>
    <Observer>{() => <View>
      <Calendar />
      <Text>{JSON.stringify(store.events)}</Text>
      {/* <Agenda<{ text: string }> items={{'2012-05-22': [{text: 'item 1 - any js object'}],
    '2012-05-23': [{text: 'item 2 - any js object'}],
    '2012-05-24': [],
    '2012-05-25': [{text: 'item 3 - any js object'}, {text: 'any js object'}]}}
        renderEmptyDate={() => <View>-</View>}
        renderItem={(item, firstItemInDay) => <View><Text>{item.text}</Text></View>}
        renderDay={(day, item) => <View />}
        rowHasChanged={(r1, r2) => r1.text !== r2.text} /> */}
    </View>}</Observer>
    {building && <Full>
      <Form ref={form} onSubmit={async values => {
        await store.createEvent(values)
        setBuilding(false)
      }} hideButton>
        <Dots path='new_event' onCancel={() => setBuilding(false)} onFinish={() => form.current.submit()} items={[
          <Center>
            <Title>
              Tee-off Time
            </Title>

            <Subtitle>
              When is this event starting?
            </Subtitle>

            <Input name='start_date' type='datetime' />

            <Subtitle>
              And when is it ending?
            </Subtitle>

            <Input name='end_date' type='datetime' />

            <Input name='is_repeatable' type='checkbox' label='Is this event repeatable?' />
          </Center>,
          <Center>
            <Title>
              Give it a name
            </Title>

            <Subtitle>
              Finally, give your event a name and a description.
            </Subtitle>

            <Input name='name' label='Event Name' />
            <Input name='description' type='multiline' label='Description' />
          </Center>,
        ]} />
      </Form>
    </Full>}
    <FloatingButton
      icon='plus'
      onPress={() => setBuilding(true)}
    />
  </>
}
