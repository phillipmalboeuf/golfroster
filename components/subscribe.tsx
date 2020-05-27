import React, { useContext, useState } from 'react'
import { FunctionComponent } from 'react'

import { View, Text, Dimensions, Linking, Alert } from 'react-native'
import { Button as PaperButton, FAB, Card, Paragraph } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { IconSource } from 'react-native-paper/lib/typescript/src/components/Icon'
import { Observer } from 'mobx-react'

import { StoreContext } from '../contexts/store'
import { StylesContext } from '../contexts/styles'
import { Subtitle } from './text'
import { Button } from './button'
import { Center, Padded } from './layouts'

export const Subscribe: FunctionComponent<{
  label: string
  onCancel: () => void
  icon?: string
}> = props => {
  const styles = useContext(StylesContext)
  const { store } = useContext(StoreContext)

  return <Observer>{() =><Center>
      <Padded>
        <Icon name={props.icon || 'account-card-details-outline'} size={66}
          color={styles.colors.blacks[2]} style={{ textAlign: 'center' }} />
        <Subtitle>The {props.label} functionaliy is only available to Pro Members.</Subtitle>
        <Button contained black pill icon='account-card-details-outline' onPress={() => {
          Linking.openURL(`https://golfroster.netlify.app/checkout?email=${store.player.email}`)
        }}>Sign Up</Button>
        <Button grey compact onPress={props.onCancel}>Cancel {props.label}</Button>
      </Padded>
    </Center>}</Observer>
}

export const MembershipCard: FunctionComponent<{
}> = props => {
  const [visible, setVisible] = useState(true)
  const { sizes, colors } = useContext(StylesContext)
  const { store } = useContext(StoreContext)


  return (store.askingForPro && visible)
    ? <Card style={{ backgroundColor: colors.faded, paddingTop: sizes.base, shadowOpacity: 0 }}>
      <Card.Title titleStyle={{
        fontSize: sizes.big,
        lineHeight: sizes.big * 1.5,
        fontWeight: 'normal',
      }} title='Sign up for Pro' />
      <Card.Content style={{ paddingHorizontal: sizes.base, marginBottom: sizes.base }}>
        <Paragraph>
          With a pro membership, you'll be able to organize an unlimited number of events,
          and create groups of players yourself.
        </Paragraph>
      </Card.Content>
      <Card.Actions style={{
        justifyContent: 'space-between',
        paddingHorizontal: sizes.base,
        paddingVertical: sizes.base / 2,
        borderTopColor: colors.greys[0],
        borderTopWidth: 1,
      }}>
        <Button contained black pill icon='account-card-details-outline' onPress={() => {
          Linking.openURL(`https://golfroster.netlify.app/checkout?email=${store.player.email}`)
        }}>Sign Up</Button>
        <Button onPress={() => {
          store.stopAskingForPro()
          setVisible(false)
        }}>Close</Button>
      </Card.Actions>
    </Card>
    : null
}

