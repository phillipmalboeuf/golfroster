
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { useContext } from 'react'

import { loadStripe } from '@stripe/stripe-js'

import { StylesContext } from '../contexts/styles'

const stripePromise = loadStripe('pk_test_kdcQC6R1EV0MoHEkH7gYLPhb00vNi71ckx')

const App = () => {
  const { colors } = useContext(StylesContext)
  
  return <>
    <section>
      <h1>Hello</h1>
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
  </>
}

ReactDOM.render(<App />, document.getElementById('main'))
