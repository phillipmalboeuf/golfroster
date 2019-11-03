import React, { useContext, useState, useEffect } from 'react'
import { FunctionComponent } from 'react'

import { Text, View, Image, Dimensions } from 'react-native'
import { Button, Appbar, Avatar as RNAvatar } from 'react-native-paper'

import { FirebaseContext } from '../contexts/firebase'
import { Center, Padded } from './layouts'


export const Avatar: FunctionComponent<{
  photo?: string
  first_name?: string
  last_name?: string
}> = ({ photo, first_name, last_name }) => {
  const { storage } = useContext(FirebaseContext)
  const [uri, setURI] = useState(undefined)

  useEffect(() => {
    storage.refFromURL(photo).getDownloadURL().then(url => setURI(url))
  }, [photo])

  return <>
    {(photo && uri)
      ? <RNAvatar.Image size={66} source={{ uri }} style={{width: 66, height: 66}} />
      : <RNAvatar.Text size={66} label={`${first_name[0]}${last_name[0]}`} />}
  </>
}

export const Background: FunctionComponent<{
  photo?: string
}> = ({ photo, children }) => {
  const { storage } = useContext(FirebaseContext)
  const [uri, setURI] = useState(undefined)

  useEffect(() => {
    storage.refFromURL(photo).getDownloadURL().then(url => setURI(url))
  }, [photo])

  return <View style={{
    backgroundColor: '#0f0f0f',
    overflow: 'hidden',
  }}>
    {(photo && uri)
      ? <Image source={{ uri }} style={{
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: -1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height / 3,
        opacity: 0.33,
      }} />
      : null}
    {children}
  </View>
}
