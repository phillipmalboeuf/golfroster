import React, { useContext, Fragment, useRef } from 'react'
import { FunctionComponent } from 'react'
import { Observer } from 'mobx-react'

import { Text } from 'react-native'
import { NativeRouter, Switch, Route, Link } from 'react-router-native'
import { List as PaperList, TouchableRipple } from 'react-native-paper'


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
  }>
}> = ({ sections }) => {

  return <>
    {sections.map((section, index) => <PaperList.Section key={index}>
      {section.title && <PaperList.Subheader>{section.title}</PaperList.Subheader>}
      {section.items.map(item => <Link to={item.link} key={item.link}>
        <PaperList.Item title={item.title}
          description={item.description}
          left={() => item.left}
          right={() => item.right} />
      </Link>)}
    </PaperList.Section>)}
  </>
}
