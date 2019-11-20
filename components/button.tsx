import React, { useContext } from 'react'
import { FunctionComponent } from 'react'

import { View, Text, Dimensions } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import { StylesContext } from '../contexts/styles'

export const Button: FunctionComponent<{
  contained?: boolean
  outlined?: boolean
  disabled?: boolean
  compact?: boolean
  onPress?: () => void
}> = props => {
  const styles = useContext(StylesContext)

  return <PaperButton mode={props.contained ? 'contained' : props.outlined ? 'outlined' : undefined}
    uppercase={false}
    disabled={props.disabled}
    compact={props.compact}
    onPress={props.onPress}
    labelStyle={{
      fontSize: styles.sizes.base,
      lineHeight: styles.sizes.base,
    }}>
    {props.children}
  </PaperButton>
}
