import { createContext } from 'react'

export const StylesContext = createContext({
  sizes: {
    huge: 42,
    big: 32,
    medium: 22,
    base: 15,
    small: 12,
  },
  colors: {
    blacks: ['hsla(0, 0%, 0%, 0.87)', 'hsla(0, 0%, 0%, 0.54)'],
    greys: ['hsla(0, 0%, 60%, 0.20)', 'hsla(0, 0%, 85%, 0.80)'],
    green: '#007251',
    red: '#CF0F42',
    yellow: '#FEF200',
  },
})
