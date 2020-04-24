import React, { useContext } from 'react'
import { FunctionComponent } from 'react'

import { View, Text, Dimensions } from 'react-native'
import { Portal } from 'react-native-paper'

export const Padded: FunctionComponent<{
  tight?: boolean
}> = props => {
  return <View style={{
    padding: props.tight ? 12 : 33,
  }}>
    {props.children}
  </View>
}

export const Center: FunctionComponent<{}> = props => {

  return <View style={{
    height: Dimensions.get('window').height,
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

  return <Portal>
    <View style={{
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
  </Portal>
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

export const TopRight: FunctionComponent<{}> = props => {
  return <View style={{
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
  }}>
    {props.children}
  </View>
}
