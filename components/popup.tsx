import React, { useContext, Fragment, useRef, useState } from 'react'
import { FunctionComponent } from 'react'
import { Portal, Modal, Surface, Dialog, Button } from 'react-native-paper'



export const Popup: FunctionComponent<{
  title?: string
  content: JSX.Element
  actions?: Array<{
    label: string
    onPress: () => void
  }>
  onDismiss?: () => void
}> = props => {

  return <Portal>
    <Dialog visible={true} onDismiss={props.onDismiss}>
      {props.title && <Dialog.Title>{props.title}</Dialog.Title>}
      <Dialog.Content>
        {props.content}
      </Dialog.Content>
      <Dialog.Actions>
        {props.actions.map(action => <Button key={action.label} uppercase={false}
          onPress={action.onPress}>{action.label}</Button>)}
      </Dialog.Actions>
    </Dialog>
  </Portal>
}
