import React, { useContext } from 'react'
import { FunctionComponent } from 'react'

import { View, Text, Dimensions } from 'react-native'
import { Button as PaperButton, FAB } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { IconSource } from 'react-native-paper/lib/typescript/src/components/Icon'

import { StylesContext } from '../contexts/styles'
import { Subtitle } from './text'

export const Empty: FunctionComponent<{
  label: string
  icon?: string
}> = props => {
  const styles = useContext(StylesContext)

  return <View style={{
      height: Dimensions.get('window').height - 200,
      display: 'flex',
      alignContent: 'center',
      justifyContent: 'center',
      opacity: 0.5,
    }}>
      <Icon name={props.icon || 'autorenew'} size={66}
        color={styles.colors.blacks[2]} style={{ textAlign: 'center' }} />
      <Subtitle>{props.label}</Subtitle>
    </View>
}
