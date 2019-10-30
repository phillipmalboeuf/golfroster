import React, { useContext } from 'react'
import { FunctionComponent } from 'react'

import { View, Text, Dimensions } from 'react-native'

export const Padded: FunctionComponent<{}> = props => {
  return <View style={{
    padding: 33,
  }}>
    {props.children}
  </View>
}

export const Center: FunctionComponent<{}> = props => {

  return <View style={{
    height: Dimensions.get('window').height - 88,
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
  }}>
    {props.children}
  </View>
}

export const Bottom: FunctionComponent<{}> = props => {

  return <View style={{
    height: 100,
    width: Dimensions.get('window').width,
    padding: 10,
    position: 'absolute',
    left: 0,
    bottom: 0,
    backgroundColor: 'white',
  }}>
    {props.children}
  </View>
}

export const Full: FunctionComponent<{}> = props => {

  return <View style={{
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 20,
    backgroundColor: 'white',
  }}>
    {props.children}
  </View>
}

export const Spaced: FunctionComponent<{}> = props => {
  return <View style={{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}>
    {props.children}
  </View>
}
