import { useState, useContext, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import FormEntry from '../components/form/Entry'
import FormInput from '../components/form/Input'

import { Store } from '../Store'
import { getError } from '../utils'
import { ApiError } from '../types/ApiError'
import inputs, { InputAttr } from '../user_input_attributes'
import fn from '../functions/common'

import { useSignInMutation } from '../hooks/userHooks'
import { login } from '../stateMgmt/actions/userActions'

export default function SignInPage() {
  const navigate = useNavigate()
  const redirect = fn.redirect()

  const [isValid, setIsValid] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { state: { userInfo }, dispatch } = useContext(Store)

  const { mutateAsync: signin, isLoading } = useSignInMutation()

  useEffect(() => {
    if (userInfo) navigate(redirect)
  }, [navigate, userInfo, redirect])

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    try {
      const data = await signin({ email, password })
      login(dispatch, data)
      navigate(redirect)
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
  }

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    setIsValid(false)
    switch (name) {
      case 'email':
        return setEmail(e.target.value)
      case 'password':
        return setPassword(e.target.value)
    }
  }

  const blurHandler = () => setIsValid(fn.hasError('signIn'))

  const fieldValue = [email, password]
  const userInputs = inputs.signIn.map((input: InputAttr, idx: number) => (
    <FormInput
      form='signIn'
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
      {isLoading ? 'Loading...' : 'Sign In'}
    </Button>

  return (
    <FormEntry
      title="Sign In"
      notify="New customer"
      inputs={userInputs}
      formButton={formButton}
      submitHandler={submitHandler}
    />
  )
}
