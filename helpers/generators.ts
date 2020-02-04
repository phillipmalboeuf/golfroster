import { Player } from '../models/player'
import { money, drinks, methods, teeChoices, timesOfDay } from '../components/player_form'

export const players = async () => {
  const response = await fetch('https://randomuser.me/api/?nat=us&results=10&inc=name,location,email,picture&noinfo')
  const { results } = await response.json()
  
  results.forEach((result, index) => {
    const player = Player.create({
      id: `random-${index}`,
    })

    player.save({
      email: result.email,
      photo: result.picture.large,
      first_name: result.name.first,
      last_name: result.name.last,
      city: result.location.city,
      state: result.location.state,
      ghin_index: parseFloat(((Math.random() * 30) - 4).toFixed(1)),
      weekends: [Object.keys(timesOfDay)[Math.floor(Math.random() * 4)]],
      weekdays: [Object.keys(timesOfDay)[Math.floor(Math.random() * 4)]],
      money: [Object.keys(money)[Math.floor(Math.random() * 4)]],
      drinks: [Object.keys(drinks)[Math.floor(Math.random() * 3)]],
      tee_choices: [Object.keys(teeChoices)[Math.floor(Math.random() * 5)]],
      methods: [Object.keys(methods)[Math.floor(Math.random() * 3)]],
      friends: ['tJnyJe7FzeekxkpVko8GjWpkTen2'],
    })
  })
}
