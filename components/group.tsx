import React, { useContext } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'

import { Text, View } from 'react-native'
import { Button, Appbar, List, Headline, Caption } from 'react-native-paper'

import { StoreContext } from '../contexts/store'
import { Group as GroupModel } from '../models/group'

import { Center, Padded, Spaced } from '../components/layouts'
import { Avatar, Background } from '../components/photos'



export const Group: FunctionComponent<{
  group: Instance<typeof GroupModel>
}> = ({ group }) => {
  const { store } = useContext(StoreContext)
  return <Observer>
  {() => <>
    <Background photo={group.photo}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <Padded>
          <View>
            <Headline style={{ color: 'white', marginBottom: 0 }}>
              {group.name}
            </Headline>
          </View>
        </Padded>
        
      </View>
    </Background>
      
    <Padded>
      <Text>{group.description}</Text>
    </Padded>
  </>}</Observer>
}
