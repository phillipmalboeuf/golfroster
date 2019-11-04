import React, { useContext, useState, useEffect } from 'react'
import { FunctionComponent } from 'react'

import { Text, View, Image, Dimensions } from 'react-native'
import { Button, Appbar, Avatar as RNAvatar } from 'react-native-paper'

import { FirebaseContext } from '../contexts/firebase'
import { Center, Padded } from './layouts'

function usePhotoURI(photo: string) {
  const { storage } = useContext(FirebaseContext)
  const [uri, setURI] = useState(undefined)

  if (photo) {
    useEffect(() => {
      storage.refFromURL(photo).getDownloadURL().then(url => setURI(url))
    }, [photo])
  }

  return uri
}

export const Avatar: FunctionComponent<{
  photo?: string
  first_name?: string
  last_name?: string
  small?: boolean
}> = ({ photo, first_name, last_name, small }) => {
  const uri = usePhotoURI(photo)
  const size = small ? 40 : 66

  return <>
    {(photo && uri)
      ? <RNAvatar.Image size={size} source={{ uri }} style={{width: size, height: size}} />
      : <RNAvatar.Text size={size} label={`${first_name[0]}${last_name[0]}`} />}
  </>
}

export const Background: FunctionComponent<{
  photo?: string
}> = ({ photo, children }) => {
  const uri = usePhotoURI(photo)

  return <View style={{
    backgroundColor: '#666666',
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
