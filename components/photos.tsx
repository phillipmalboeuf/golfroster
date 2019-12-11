import React, { useContext, useState, useEffect } from 'react'
import { FunctionComponent } from 'react'

import { Text, View, Image, Dimensions } from 'react-native'
import { Button, Appbar, Avatar as RNAvatar, ActivityIndicator } from 'react-native-paper'
import ImagePicker from 'react-native-image-picker'

import { FirebaseContext } from '../contexts/firebase'
import { StylesContext } from '../contexts/styles'
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

async function uploadPhoto(uri: string, filename: string, contentType: string, storage: firebase.storage.Storage) {
  const image = await fetch(uri)
  const ref = storage.ref(filename)
  await storage.ref(filename).put(await image.blob(), { contentType })
  
  return {
    storageURL: `gs://${ref.bucket}/${ref.fullPath}`,
    downloadURL: await ref.getDownloadURL(),
  }
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
      : <RNAvatar.Text size={size} label={first_name && last_name && `${first_name[0]}${last_name[0]}`} />}
  </>
}

export const Background: FunctionComponent<{
  photo?: string
}> = ({ photo, children }) => {
  const uri = usePhotoURI(photo)
  const { colors } = useContext(StylesContext)

  return <View style={{
    backgroundColor: colors.blacks[0],
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

export const Upload: FunctionComponent<{
  onUpload: (url: string) => void
  avatar?: boolean
}> = ({ onUpload, avatar }) => {
  const { storage } = useContext(FirebaseContext)
  const { colors } = useContext(StylesContext)

  const [uploaded, setUploaded] = useState<string>(undefined)
  const [loading, setLoading] = useState(false)

  return <View style={{ alignItems: 'center' }}>
    {avatar
      ? loading
        ? <RNAvatar.Icon icon={({ size, color }) => <ActivityIndicator color={color} />} size={88} />
        : <RNAvatar.Image size={88} source={{ uri: uploaded }} style={{width: 88, height: 88}} />
      : loading
        ? <Image source={{ uri: uploaded }} style={{width: 242, height: 166, backgroundColor: colors.green }} />
        : <View style={{width: 242, height: 166, backgroundColor: colors.green }}>
          <ActivityIndicator />
        </View>}
    <Button style={{ marginTop: 6 }} onPress={() => {
      ImagePicker.showImagePicker({
        title: 'Upload Photo',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      }, async response => {
        if (!response.didCancel) {
          setLoading(true)

          const { storageURL, downloadURL } = await uploadPhoto(response.uri,
            `${new Date().getTime()}/${response.fileName}`, response.type, storage)

          setLoading(false)
          setUploaded(downloadURL)
          onUpload(storageURL)
        }
      })
    }}>Upload Photo</Button>
  </View>
}
