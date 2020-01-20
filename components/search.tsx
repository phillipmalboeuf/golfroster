import React, { useContext, useState, Component, ComponentElement } from 'react'
import { FunctionComponent } from 'react'

import { View, Text, Dimensions, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Modal, Portal, Surface, Searchbar } from 'react-native-paper'

import search from '../clients/algolia'
import { Form } from './form'
import { Input } from './input'

import { StoreContext } from '../contexts/store'
import { StylesContext } from '../contexts/styles'
import { Padded } from './layouts'
import { Italic } from './text'
import { List } from './list'



export const Search: FunctionComponent<{
  index: string
  filters?: string
  visible: boolean
  renderHit: (hit: any) => string
  onDismiss: () => void
}> = ({ index, filters, visible, renderHit, onDismiss }) => {
  const { colors } = useContext(StylesContext)
  const { store } = useContext(StoreContext)
  const searchIndex = search.initIndex(index)
  const [query, setQuery] = useState<string>()
  const [hits, setHits] = useState<any[]>()

  return <Portal>
    <Modal visible={visible} onDismiss={onDismiss}>
      <Surface style={{ backgroundColor: colors.green }}>
        <Padded tight>
          <Searchbar value={query} placeholder={`Search ${index}`} style={{ backgroundColor: 'white' }}
            autoFocus autoCorrect={false}
            onChangeText={async text => {
              setQuery(text)
              const response = await searchIndex.search({ query: text, filters })
              setHits(response.hits)
              // console.log(response)
            }} />
        </Padded>
        {hits && <ScrollView>
          {hits.length 
            ? <List sections={[{
              items: hits.filter(hit => hit.objectID !== store.player.id).map(hit => ({
                title: renderHit(hit),
                link: `/players/${hit.objectID}`,
              })),
            }]} />
            : <View style={{ padding: 6, backgroundColor: 'white' }}>
              <Italic>No {index} found</Italic>
            </View>}
        </ScrollView>}
        {/* <Form inline onSubmit={async ({ query }) => {
          const response = await searchIndex.search({ query })
          console.log(response)
        }} cta={<Icon name='magnify' size={33} />}>
          <Input name='query' placeholder={`Search ${index}`} />
        </Form> */}
      </Surface>
    </Modal>
  </Portal>
}
