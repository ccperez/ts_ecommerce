import { useState, useContext, useEffect } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import FormCheckout from '../components/form/Checkout'
import CheckoutSteps from '../components/CheckoutSteps'

import { Store } from '../Store'
import { payment } from '../stateMgmt/actions/cartActions'

export default function PaymentMethodPage() {
  const { state, dispatch } = useContext(Store)
  const { shippingAddress, paymentMethod } = state.cart

  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethodName, setPaymentMethodName] =
    useState(paymentMethod || 'PayPal')

  const navigate = useNavigate()

  useEffect(() => {
    if (!shippingAddress) navigate('/shipping')
  }, [shippingAddress, navigate])

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setIsLoading(true)
    payment(dispatch, paymentMethodName)
    setIsLoading(false)
    navigate('/placeorder')
  }

  const userInputs =
    <>
      <div className="mb-3">
        <Form.Check
          type="radio"
          id="PayPal"
          label="PayPal"
          value="PayPal"
          checked={paymentMethodName === 'PayPal'}
          onChange={(e) => setPaymentMethodName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <Form.Check
          type="radio"
          id="Stripe"
          label="Stripe"
          value="Stripe"
          checked={paymentMethodName === 'Stripe'}
          onChange={(e) => setPaymentMethodName(e.target.value)}
        />
      </div>
    </>

  const formButton =
    <Button className='w-100' type="submit" disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Continue'}
    </Button>

  return (
    <FormCheckout
      title="Payment Method"
      CheckoutSteps={<CheckoutSteps step1 step2 step3 />}
      submitHandler={submitHandler}
      userInputs={userInputs}
      formButton={formButton}
    />
  )
}
