import { types } from 'mobx-state-tree'

export const Event = types.model({
  name: types.string,
  description: types.maybe(types.string),
  start_date: types.Date,
  end_date: types.Date,
})
