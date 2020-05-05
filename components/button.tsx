import React, { useContext } from 'react'
import { FunctionComponent } from 'react'

import { View, Text, Dimensions } from 'react-native'
import { Button as PaperButton, FAB } from 'react-native-paper'
import { IconSource } from 'react-native-paper/lib/typescript/src/components/Icon'

import { StylesContext } from '../contexts/styles'

export const Button: FunctionComponent<{
  contained?: boolean
  pill?: boolean
  outlined?: boolean
  disabled?: boolean
  compact?: boolean
  icon?: string
  black?: boolean
  grey?: boolean
  facebook?: boolean
  onPress?: () => void
}> = props => {
  const styles = useContext(StylesContext)

  return <PaperButton mode={props.contained ? 'contained' : props.outlined ? 'outlined' : undefined}
    uppercase={false}
    disabled={props.disabled}
    compact={props.compact}
    onPress={props.onPress}
    icon={props.icon}
    labelStyle={{
      fontSize: styles.sizes.base,
      ...props.grey && { color: styles.colors.blacks[1] },
      ...props.compact && { marginTop: styles.sizes.base/3 },
      // lineHeight: styles.sizes.base * 1.25,
    }}
    style={{
      ...props.compact && { height: styles.sizes.base*2 },
      ...props.pill && { borderRadius: styles.sizes.base * 1.333 },
      ...props.icon && { paddingRight: styles.sizes.base / 2 },
      ...props.black && { backgroundColor: styles.colors.blacks[0] },
      ...props.facebook && { backgroundColor: styles.colors.facebook },
    }}>
    {props.children}
  </PaperButton>
}

export const FloatingButton: FunctionComponent<{
  icon: IconSource
  onPress?: () => void
}> = props => {
  const { colors } = useContext(StylesContext)
  return <FAB
    style={{
      position: 'absolute',
      right: 16,
      bottom: 25,
      backgroundColor: colors.green,
    }}
    icon={props.icon}
    onPress={props.onPress}
  />
}
