
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useContext } from 'react'

import { loadStripe } from '@stripe/stripe-js'

import { StylesContext } from '../contexts/styles'
import { BrowserRouter, Route } from 'react-router-dom'

const stripePromise = loadStripe('pk_test_kdcQC6R1EV0MoHEkH7gYLPhb00vNi71ckx')

const App = () => {
  const { colors } = useContext(StylesContext)
  
  return <>
    <BrowserRouter>
      <Route exact path='/checkout'>
        <section>
          <h1>Pro membership</h1>
          <p>If you’re a club or organization that is interested in finding out more about using GolfRoster for your membership please inquire at <a href='jesse@golfroster.com' target='_blank'>jesse@golfroster.com</a>.</p>
          
          <button onClick={async () => {
            const stripe = await stripePromise
            await stripe.redirectToCheckout({
              items: [
                { plan: 'pro-monthly', quantity: 1 },
              ],
              customerEmail: new URLSearchParams(window.location.search).get('email').replace(' ', '+'),
              successUrl: 'https://golfroster.com/success',
              cancelUrl: 'https://golfroster.com/cancel',
            })
          }}>Proceed to Checkout</button>
        </section>
      </Route>
      <Route exact path='/'>
        <section>
          <svg width='46' height='50' viewBox='0 0 46 50' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path d='M11.968 26.688C9.28 26.688 7.616 24.448 7.616 20.416C7.616 15.104 10.592 6.72 16.064 6.72C18.912 6.72 20.192 8.928 20.32 12.704H21.792L22.848 7.168C21.376 6.08 18.656 5.216 15.84 5.216C7.584 5.216 1.216 11.264 1.216 19.072C1.216 24.608 5.216 28.32 11.52 28.32C14.944 28.32 17.44 27.584 19.904 26.176L21.056 20.864C21.408 19.2 21.6 18.912 23.712 18.688L24 17.344H13.6L13.28 18.688C15.36 18.912 15.52 19.168 15.168 20.864L13.984 26.304C13.312 26.624 12.736 26.688 11.968 26.688Z' fill='black'/>
          <path d='M35.056 19.104C37.776 19.104 38.896 20.736 38.896 22.848C38.896 27.168 36.208 29.024 33.04 29.024H32.144L34.224 19.104H35.056ZM31.792 30.624H33.104L35.504 36.608C36.112 38.208 36.688 39.296 37.456 40H44.432L44.688 38.656C43.216 38.592 42.736 37.984 41.808 36.064L38.672 29.696C41.104 29.12 45.072 27.04 45.072 22.944C45.072 20 42.96 17.536 37.808 17.536H26.032L25.712 18.88C27.792 19.104 27.952 19.36 27.6 21.024L24.304 36.512C23.92 38.176 23.728 38.432 21.52 38.656L21.232 40H32.144L32.4 38.656C30.352 38.432 30.16 38.176 30.544 36.512L31.792 30.624Z' fill='#007251'/>
          </svg>

          <h1>GolfRoster</h1>
          <h3>Organize ideal tee-offs and connect with likeminded players with minimal effort</h3>
          <p>If you’re a club or organization that is interested in finding out more about using GolfRoster for your membership please inquire at <a href='jesse@golfroster.com' target='_blank'>jesse@golfroster.com</a>.</p>
          <button>
            <img src={require('./apple_download.svg')} alt='Download on the App Store' width={202} />
          </button>
        </section>
      </Route>
    </BrowserRouter>
    <footer>
      <small>&copy; GolfRoster 2020</small>
      <nav>
        <a href='/terms'>Terms &amp; Conditions</a>
        <a href='/privacy'>Privacy Policy</a>
      </nav>
      <a href='jesse@golfroster.com' target='_blank'>
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path fill-rule='evenodd' clip-rule='evenodd' d='M2 4H22V20H2V4ZM12 13L20 8V6L12 11L4 6V8L12 13Z' fill='#007251'/>
        </svg>
      </a>
    </footer>
  </>
}

ReactDOM.render(<App />, document.getElementById('main'))
