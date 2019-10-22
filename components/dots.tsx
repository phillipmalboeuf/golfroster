import React, { useContext, useState, Component, ComponentElement } from 'react'
import { FunctionComponent } from 'react'

import { View, Text, Dimensions } from 'react-native'
import { Center, Bottom, Spaced } from './layouts'
import { Button } from 'react-native-paper'
import { NativeRouter, Switch, Route, Redirect, useHistory, Link } from 'react-router-native'

export const Dots: FunctionComponent<{
  path: string
  items: JSX.Element[]
  hideButtons?: boolean
  onFinish?: () => void
}> = props => {

  // let history = useHistory()
  const [active, setActive] = useState(0)
  
  return <View>
    <NativeRouter>
      <Switch>
        {props.items.map((item, index) => (
          <Route key={index} exact path={`/${props.path}/${index}`} render={() => {
            setActive(index)
            return item
          }} />
        ))}
        <Route render={() => {
          return <Redirect to={`/${props.path}/0`} />
        }} />
      </Switch>

      <Bottom>
        <Spaced>
          {!props.hideButtons ? <Link disabled={active === 0} to={`/${props.path}/${active - 1}`}>
            <Button disabled={active === 0} uppercase={false} compact>Previous</Button>
          </Link> : <View />}
          
          <View style={{ flexDirection: 'row' }}>
            {props.items.map((item, index) =>
              <Text style={{
                opacity: active === index ? 1 : 0.38,
                padding: 3,
                fontSize: 9,
              }} key={index}>●</Text>
            )}
          </View>

          {!props.hideButtons ? (active === props.items.length - 1
            ? <Button uppercase={false} compact onPress={() => props.onFinish()}>Finish</Button>
            :  <Link to={`/${props.path}/${active + 1}`}>
              <Button uppercase={false} compact>Next</Button>
          </Link>) : <View />}
        </Spaced>
      </Bottom>
    </NativeRouter>
  </View>
}
