import React, { useContext } from 'react'
import { FunctionComponent } from 'react'
import { List } from 'react-native-paper'

import { Padded } from './layouts'
import { Subheader } from './text'
import { usePlayer } from '../routes/players'
import { Avatar } from './photos'
import { Link } from 'react-router-native'

const Member: FunctionComponent<{
  id: string
  isOrganizer: boolean
}> = ({ id, isOrganizer }) => {
  const player = usePlayer(id)
  return player
    ? <Link to={`/players/${id}`}>
      <List.Item style={{ backgroundColor: 'white' }} title={`${player.first_name} ${player.last_name}`}
        description={<>{isOrganizer ? 'Organizer' : ''}</>}
        left={() => <Avatar {...player} small />} />
    </Link>
    : null
}

export const Members: FunctionComponent<{
  label: string
  ids: string[]
  organizer: string
}> = ({ label, ids, organizer }) => {

  return <Padded tight>
    <Subheader>{label}</Subheader>
    <List.Section>
      {ids.map(id => <Member key={id} id={id} isOrganizer={id === organizer} />)}
    </List.Section>
  </Padded>
}

