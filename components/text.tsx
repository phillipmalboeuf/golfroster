import React, { useContext } from 'react'
import { FunctionComponent } from 'react'

import { View, Text, Dimensions } from 'react-native'
import { Headline, Subheading } from 'react-native-paper'
import { StylesContext } from '../contexts/styles'

export const Title: FunctionComponent<{}> = props => {
  const styles = useContext(StylesContext)

  return <Headline style={{
    fontWeight: 'bold',
    fontSize: styles.sizes.big,
    lineHeight: styles.sizes.big,
    textAlign: 'center',
    marginBottom: styles.sizes.base / 2,
  }}>
    {props.children}
  </Headline>
}

export const Subtitle: FunctionComponent<{}> = props => {
  const styles = useContext(StylesContext)

  return <Subheading style={{
    fontSize: styles.sizes.base,
    lineHeight: styles.sizes.base * 1.333,
    textAlign: 'center',
    marginBottom: styles.sizes.base * 2,
  }}>
    {props.children}
  </Subheading>
}
