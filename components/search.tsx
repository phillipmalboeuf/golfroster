import React, { useContext, useState, Component, ComponentElement } from 'react'
import { FunctionComponent } from 'react'

import { View, Text, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import search from '../clients/algolia'
import { Form } from './form'
import { Input } from './input'


export const Search: FunctionComponent<{
  index: string
}> = ({ index }) => {
  const searchIndex = search.initIndex(index)
  return <Form inline onSubmit={async ({ query }) => {
    const response = await searchIndex.search({ query })
    console.log(response)
  }} cta={<Icon name='magnify' size={33} />}>
    <Input name='query' placeholder={`Search ${index}`} />
  </Form>
}
