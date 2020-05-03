import React, { useContext, useState } from 'react'
import { FunctionComponent } from 'react'
import { Appbar, Menu as PaperMenu } from 'react-native-paper'
import { useHistory } from 'react-router-native'

export const Menu: FunctionComponent<{
  light?: boolean
}> = props => {

  const history = useHistory()
  const [visible, setVisible] = useState(false)

  return <PaperMenu
    contentStyle={{ backgroundColor: 'white' }}
    visible={visible}
    onDismiss={() => setVisible(false)}
    anchor={<Appbar.Action color={props.light ? undefined : 'white'} icon='dots-vertical' onPress={() => setVisible(true)} />}>
    {props.children}
    <MenuItem onPress={() => history.push('/profile/settings/help')} title='Help & Contact Us' />
  </PaperMenu>
}

export const MenuItem: FunctionComponent<{
  onPress: () => void
  title: string
}> = props => {
  return <PaperMenu.Item {...props} />
}