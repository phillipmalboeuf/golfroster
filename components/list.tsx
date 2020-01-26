import React, { useContext, Fragment, useRef } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'

import { Text } from 'react-native'
import { NativeRouter, Switch, Route, Link } from 'react-router-native'
import { List as PaperList, TouchableRipple } from 'react-native-paper'

import { StylesContext } from '../contexts/styles'


export const List: FunctionComponent<{
  sections: Array<{
    title?: string
    items: Array<{
      title: string | JSX.Element
      link: string
      description?: string| JSX.Element
      left?: JSX.Element
      right?: JSX.Element
    }>
    onItemClick?: () => void
  }>
}> = ({ sections }) => {
  const { colors, sizes } = useContext(StylesContext)

  return <>
    {sections.map((section, index) => <PaperList.Section key={index} style={{ marginBottom: 0 }}>
      {section.title && <PaperList.Subheader>{section.title}</PaperList.Subheader>}
      {section.items.map(item => <Link to={item.link} key={item.link} onPress={section.onItemClick}>
        <PaperList.Item style={{
          backgroundColor: 'white',
        }} title={item.title}
          description={item.description}
          left={() => item.left}
          right={() => item.right} />
      </Link>)}
    </PaperList.Section>)}
  </>
}
