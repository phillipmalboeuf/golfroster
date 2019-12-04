import React, { useContext } from 'react'
import { FunctionComponent } from 'react'

import { View, Text, Dimensions } from 'react-native'
import { Headline, Subheading } from 'react-native-paper'
import { StylesContext } from '../contexts/styles'

export const Italic: FunctionComponent<{}> = props => {
  return <Text style={{ fontStyle: 'italic' }}>{props.children}</Text>
}

export const Bold: FunctionComponent<{}> = props => {
  return <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>
}

export const Title: FunctionComponent<{}> = props => {
  const { sizes } = useContext(StylesContext)

  return <Headline style={{
    fontWeight: 'bold',
    fontSize: sizes.big,
    lineHeight: sizes.big,
    textAlign: 'center',
    marginBottom: sizes.base / 2,
  }}>
    {props.children}
  </Headline>
}

export const Subtitle: FunctionComponent<{
  topMargin?: boolean
}> = props => {
  const { sizes } = useContext(StylesContext)

  return <Subheading style={{
    fontSize: sizes.base,
    lineHeight: sizes.base * 1.333,
    textAlign: 'center',
    ...props.topMargin
      ? { marginTop: sizes.base }
      : { marginBottom: sizes.base * 2 },
  }}>
    {props.children}
  </Subheading>
}

export const Subheader: FunctionComponent<{
}> = props => {
  const { sizes, colors } = useContext(StylesContext)

  return <Subheading style={{
    fontSize: sizes.base,
    lineHeight: sizes.base * 1.333,
    letterSpacing: 0,
    fontWeight: '600',
    color: colors.blacks[0],
  }}>
    {props.children}
  </Subheading>
}
