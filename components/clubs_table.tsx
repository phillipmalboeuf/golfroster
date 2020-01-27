import React, { useContext, useRef, useState } from 'react'
import { FunctionComponent } from 'react'
import { View, Text, Dimensions } from 'react-native'
import { Headline, Subheading, Caption, DataTable, TextInput, Portal } from 'react-native-paper'

import { Input } from './input'
import { FormContext } from './form'
import { StylesContext } from '../contexts/styles'


export const ClubsTable: FunctionComponent<{}> = props => {
  const [length, setLength] = useState(1)

  return <DataTable>
    <DataTable.Header>
      <Input type='checkbox' name='title' disabled />
      <DataTable.Title>Club Name</DataTable.Title>
      <DataTable.Title>City (State)</DataTable.Title>
    </DataTable.Header>

    <DataTable.Row>
      <Input type='checkbox' name={`clubs.donnybrook`} />
      <DataTable.Cell>Donnybrook CC</DataTable.Cell>
      <DataTable.Cell>Berkshires (MA)</DataTable.Cell>
    </DataTable.Row>

    {new Array(length).fill(null).map((_, index) => <ClubRow key={index} onEdited={() => setLength(length + 1)} />)}
  </DataTable>
}

const ClubRow: FunctionComponent<{
  onEdited: () => void
}> = props => {

  const [name, setName] = useState()
  // const [city, setCity] = useState('')
  // const [state, setState] = useState('')

  return <>
  <DataTable.Row>
    <Input type='checkbox' name={`clubs.${name}`} disabled={!name} />
    <ClubInput label={'Another Club'} onChange={value => {
      if (name === undefined) { props.onEdited() }
      setName(value)
    }} />
    {/* <DataTable.Cell onPress={() => undefined}>
      
    </DataTable.Cell> */}
    {/* <DataTable.Cell> */}
      {/* <TextInput mode='flat' placeholder={'City'} style={{ fontSize: sizes.base }}
        value={city}
        autoCorrect={false}
        onChangeText={text => setCity(text)} />
      <TextInput mode='flat' placeholder={'State'} style={{ fontSize: sizes.base }}
        value={state}
        autoCorrect={false}
        onChangeText={text => setState(text)} /> */}
    {/* </DataTable.Cell> */}
  </DataTable.Row>
  </>
}

const ClubInput: FunctionComponent<{
  label: string
  onChange?: (text: string) => void
}> = ({ label, onChange }) => {
  const { colors, sizes } = useContext(StylesContext)

  return <TextInput mode='flat' style={{
    fontSize: sizes.base,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    width: 200,
  }} placeholder={label}
    autoCorrect={false}
    onChangeText={onChange} />
}
