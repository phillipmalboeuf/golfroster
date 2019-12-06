import React, { useContext, Fragment, useRef, useState } from 'react'
import { FunctionComponent } from 'react'
import { Portal, Modal, Surface, Dialog } from 'react-native-paper'

import { Button } from './button'


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
    <Dialog visible={true} style={{ backgroundColor: 'white' }} onDismiss={props.onDismiss}>
      {props.title && <Dialog.Title>{props.title}</Dialog.Title>}
      <Dialog.Content>
        {props.content}
      </Dialog.Content>
      <Dialog.Actions>
        {props.actions.map(action => <Button key={action.label} onPress={action.onPress}>
          {action.label}
        </Button>)}
      </Dialog.Actions>
    </Dialog>
  </Portal>
}
