import React, { useContext, useState, useRef, Component, ComponentElement } from 'react'
import { FunctionComponent } from 'react'

import { View, Text, Dimensions, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Modal, Dialog, Portal, Surface, Searchbar, Caption, Chip } from 'react-native-paper'

import search from '../clients/algolia'
import { Form } from './form'
import { Input } from './input'

import { StoreContext } from '../contexts/store'
import { StylesContext } from '../contexts/styles'
import { Padded } from './layouts'
import { Italic, Subheader } from './text'
import { Popup } from './popup'
import { List } from './list'

import { money, drinks, methods, teeChoices, timesOfDay } from './player_form'


export const Search: FunctionComponent<{
  index: string
  visible: boolean
  renderHit: (hit: any) => string
  onDismiss: () => void
}> = ({ index, visible, renderHit, onDismiss }) => {
  const { colors, sizes } = useContext(StylesContext)
  const { store } = useContext(StoreContext)
  const searchIndex = search.initIndex(index)
  const [query, setQuery] = useState<string>()
  const [filters, setFilters] = useState<string[]>()
  const [hits, setHits] = useState<any[]>()

  return <Portal>
    <Modal contentContainerStyle={{
      marginBottom: 'auto',
    }} visible={visible} onDismiss={onDismiss}>
      <Surface style={{ backgroundColor: colors.green, maxHeight: '100%' }}>
        <Padded tight>
          <Searchbar value={query} placeholder={`Search ${index}`} style={{ backgroundColor: 'white' }}
            autoFocus autoCorrect={false}
            onChangeText={async text => {
              setQuery(text)
              const response = await searchIndex.search({ 
                query: text,
                ...filters && { filters: filters.join(' AND ') },
              })
              setHits(response.hits)
            }} />
          <Caption style={{ color: 'white' }}><Icon name='filter-variant' size={sizes.small} /> Search filters</Caption>
          <Filters onChange={async values => {
            setFilters(values)
            const response = await searchIndex.search({
              query,
              filters: values.join(' AND '),
            })
            setHits(response.hits)
          }} />
        </Padded>
        {hits && <ScrollView>
          {hits.length 
            ? <List sections={[{
              items: hits.filter(hit => hit.objectID !== store.player.id).map(hit => ({
                title: renderHit(hit),
                link: `/${index}/${hit.objectID}`,
              })),
              onItemClick: () => onDismiss(),
            }]} />
            : <View style={{ padding: 6, backgroundColor: 'white' }}>
              <Italic>No {index} found</Italic>
            </View>}
        </ScrollView>}
      </Surface>
    </Modal>
  </Portal>
}


const Filters: FunctionComponent<{
  onChange: (filters: string[]) => void
}> = ({ onChange }) => {

  const [index, setIndex] = useState<string[]>([])
  const [times, setTimes] = useState<string[]>([])
  const [socializing, setSocializing] = useState<string[]>([])
  const [choice, setChoice] = useState<string[]>([])
  const [play, setPlay] = useState<string[]>([])

  return <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row' }}>
    <Filter label='GHIN Index' key='' onChange={filters => {
      setIndex(filters)
      onChange([...filters, ...socializing, ...times, ...choice, ...play])
    }} />
    <Filter label='Tee-off Times' onChange={filters => {
      setTimes(filters)
      onChange([...filters, ...index, ...socializing, ...choice, ...play])
    }} />
    <Filter label='Tee Choice' onChange={filters => {
      setChoice(filters)
      onChange([...filters, ...socializing, ...index, ...times, ...play])
    }} />
    <Filter label='Socializing' onChange={filters => {
      setSocializing(filters)
      onChange([...filters, ...index, ...times, ...choice, ...play])
    }} />
    <Filter label='Methods of Play' onChange={filters => {
      setPlay(filters)
      onChange([...filters, ...index, ...socializing, ...choice, ...times])
    }} />
  </ScrollView>
}


function toArray(o: { [key: string]: any }) {
  return Object.keys(o).filter(key => o[key])
}

const Filter: FunctionComponent<{
  label: string
  onChange: (filters: string[]) => void
}> = ({ label, onChange }) => {
  const { colors, sizes } = useContext(StylesContext)

  const [filters, setFilters] = useState<string[]>()
  const [editing, setEditing] = useState(false)

  const form = useRef<Form>()

  async function addFilterValues(values: { [key: string]: any; }) {
    setFilters(toArray(values))
    onChange(toArray(values))
    setEditing(false)
  }

  return <>
    <Chip onPress={() => setEditing(true)}
      {...filters && { onClose: () => {
        setFilters(undefined)
        onChange([])
      } }}
      textStyle={{ color: 'white', fontSize: sizes.small }}
      style={{
        borderColor: colors.yellow.replace('1)', '0.3)'),
        ...filters 
          ? { backgroundColor: colors.yellow.replace('1)', '0.3)') }
          : { backgroundColor: 'transparent' },
        marginRight: sizes.base / 2,
      }}>
      {filters
        // ? filters.map(filter => filter.split(':')).map(filter => ({
        //   money: money[filter[1]],
        //   drinks: drinks[filter[1]],
        // }[filter[0]])).join(', ')
        ? filters.map(filter => filter.replace('_', ' ').replace('TO', 'to')).join(', ')
        : label}
    </Chip>
    <Portal>
      <Popup visible={editing} onDismiss={() => setEditing(false)}
        title={label}
        content={({
          'GHIN Index': () => <Form ref={form} hideButton onSubmit={async values => {
            const range = `ghin_index:${[values.from_ghin || 0, values.to_ghin || 50].join(' TO ')}`
            setFilters([range])
            onChange([range])
            setEditing(false)
          }}>
            <Caption>
              Filter by their GHIN Index / Estimated Handicap
            </Caption>

            <Input name='from_ghin' type='slider' label='From' min={-5.0} max={50} />
            <Input name='to_ghin' type='slider' label='To' min={-5.0} max={50} />
          </Form>,

          'Socializing': () => <Form ref={form} hideButton onSubmit={addFilterValues}>
            <Caption>
              Filter by if they play for money
            </Caption>

            {Object.keys(money)
              .map(key => <Input key={key} name={`money:${key}`} type='checkbox' label={money[key]} />)}

            <View style={{ marginBottom: sizes.base * 2 }} />

            <Caption>
              Filter by if they drink on the golf course
            </Caption>

            {Object.keys(drinks)
              .map(key => <Input key={key} name={`drinks:${key}`} type='checkbox' label={drinks[key]} />)}
          </Form>,

          'Tee-off Times': () => <Form ref={form} hideButton onSubmit={addFilterValues}>
            <Caption>
              Filter by when they prefer to play
            </Caption>

            <Caption style={{ fontWeight: 'bold' }}>Weekends</Caption>
            {Object.keys(timesOfDay)
              .map(key => <Input key={key} name={`weekends:${key}`} type='checkbox' label={timesOfDay[key]} />)}

            <Caption style={{ fontWeight: 'bold', marginTop: sizes.base }}>Weekdays</Caption>
            {Object.keys(timesOfDay)
              .map(key => <Input key={key} name={`weekdays:${key}`} type='checkbox' label={timesOfDay[key]} />)}
          </Form>,

          'Tee Choice': () => <Form ref={form} hideButton onSubmit={addFilterValues}>
            <Caption>
              Filter by from where they play
            </Caption>

            {Object.keys(teeChoices)
              .map(key => <Input key={key} name={`tee_choices:${key}`} type='checkbox' label={teeChoices[key]} />)}
          </Form>,

          'Methods of Play': () => <Form ref={form} hideButton onSubmit={addFilterValues}>
            <Caption>
              Filter by their preferred methods of play
            </Caption>

            {Object.keys(methods)
              .map(key => <Input key={key} name={`methods:${key}`} type='checkbox' label={methods[key]} />)}
          </Form>,
        }[label] || (() => <></>))()} actions={[
          { label: 'Cancel', onPress: () => setEditing(false) },
          { label: 'Add Filters', onPress: () => { if (form.current) { form.current.submit() } } },
        ]} />
    </Portal>
  </>
}
