import React, { useContext, useState } from 'react'
import { FunctionComponent } from 'react'
import { Link } from 'react-router-native'
import { List } from 'react-native-paper'
import { Instance } from 'mobx-state-tree'

import { Group } from '../models/group'

import { Padded, Spaced, Full } from './layouts'
import { Subheader } from './text'
import { Avatar } from './photos'
import { Button } from './button'

import { usePlayer } from '../helpers/hooks'
import { StoreContext } from '../contexts/store'
import { InvitesForm } from './invites_form'


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
  group: Instance<typeof Group>
}> = ({ label, ids, organizer, group }) => {

  const { store } = useContext(StoreContext)
  const [inviting, setInviting] = useState(false)

  return <>
    <Padded tight>
      <Spaced>
        <Subheader>{label}</Subheader>
        {organizer === store.player.id && <Button outlined compact
          onPress={() => setInviting(true)}>+ Invite new player</Button>}
      </Spaced>
      <List.Section>
        {ids.map(id => <Member key={id} id={id} isOrganizer={id === organizer} />)}
      </List.Section>
    </Padded> 

    {inviting && <Full><InvitesForm group={group} 
      onSubmit={() => setInviting(false)} onCancel={() => setInviting(false)} /></Full>}
  </>
}

