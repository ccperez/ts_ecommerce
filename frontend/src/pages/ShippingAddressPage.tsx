import { useState, useContext, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import CheckoutSteps from '../components/CheckoutSteps'
import FormCheckout from '../components/form/Checkout'
import FormInput from '../components/form/Input'
import inputs, { InputAttr } from '../user_input_attributes'

import { Store } from '../Store'
import { shipping } from '../stateMgmt/actions/cartActions'
import fn from '../functions/common'

export default function ShippingAddressPage() {
  const navigate = useNavigate()
  const { state: { cart: { shippingAddress } }, dispatch } = useContext(Store)

  const [fullName, setFullName] = useState(shippingAddress.fullName || '')
  const [address, setAddress] = useState(shippingAddress.address || '')
  const [city, setCity] = useState(shippingAddress.city || '')
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '')
  const [country, setCountry] = useState(shippingAddress.country || '')

  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const shippingInfo = { fullName, address, city, postalCode, country }
    shipping(dispatch, shippingInfo)
    setIsLoading(false)
    navigate('/payment')
  }

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    setIsValid(false)
    const { value } = e.target
    switch (name) {
      case 'fullName':
        return setFullName(value)
      case 'address':
        return setAddress(value)
      case 'city':
        return setCity(value)
      case 'postalCode':
        return setPostalCode(value)
      case 'country':
        return setCountry(value)
    }
  }

  const blurHandler = () => setIsValid(fn.hasError('shipping'))

  const fieldValue = [fullName, address, city, postalCode, country]
  const userInputs = inputs.shipping.map((input: InputAttr, idx: number) => (
    <FormInput
      form='shipping'
      key={input.name}
      type={input.type}
      name={input.name}
      label={input.label}
      value={fieldValue[idx]}
      autoFocus={input.autofocus}
      onChange={(e) => changeHandler(e, input.name)}
      onBlur={blurHandler}
    />
  ))

  const formButton =
    <Button className='w-100' type="submit" disabled={!(isValid) && !isLoading}>
      {isLoading ? 'Loading...' : 'Continue'}
    </Button>

  return (
    <FormCheckout
      title="Shipping Address"
      CheckoutSteps={<CheckoutSteps step1 step2 />}
      submitHandler={submitHandler}
      userInputs={userInputs}
      formButton={formButton}
    />
  )
}