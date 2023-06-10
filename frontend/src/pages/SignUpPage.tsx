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

import { useSignUpMutation } from '../hooks/userHooks'
import { login } from '../stateMgmt/actions/userActions'

export default function SignUpPage() {
  const navigate = useNavigate()
  const redirect = fn.redirect()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { state: { userInfo }, dispatch } = useContext(Store)

  const { mutateAsync: signup, isLoading } = useSignUpMutation()

  useEffect(() => {
    if (userInfo) navigate(redirect)
  }, [navigate, redirect, userInfo])

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('password do not match')
      return
    }

    try {
      const data = await signup({ name, email, password })
      login(dispatch, data)
      navigate(redirect)
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
  }

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    switch (name) {
      case 'name':
        return setName(e.target.value)
      case 'email':
        return setEmail(e.target.value)
      case 'password':
        return setPassword(e.target.value)
      case 'confirmPassword':
        return setConfirmPassword(e.target.value)
    }
  }

  const fieldValue = [name, email, password]
  const userInputs = inputs.signUp.map((input: InputAttr, idx: number) => (
    <FormInput
      key={input.name}
      form='signUp'
      type={input.type}
      name={input.name}
      label={input.label}
      value={fieldValue[idx]}
      autoFocus={input.autofocus}
      onChange={(e) => changeHandler(e, input.name)}
    />
  ))

  const formButton =
    <Button className='w-100' type="submit" disabled={!(name && email && password) && !isLoading}>
      {isLoading ? 'Loading...' : 'Sign Up'}
    </Button>

  return (
    <FormEntry
      title="Sign Up"
      notify="Already have an account"
      inputs={userInputs}
      formButton={formButton}
      submitHandler={submitHandler}
    />
  )
}
