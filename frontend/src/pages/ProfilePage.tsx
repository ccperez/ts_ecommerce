import { useContext, useState } from 'react'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'

import FormEntry from '../components/form/Entry'
import FormInput from '../components/form/Input'

import { Store } from '../Store'
import { getError } from '../utils'
import { ApiError } from '../types/ApiError'
import inputs, { InputAttr } from '../user_input_attributes'
import fn from '../functions/common'

import { useUpdateProfileMutation } from '../hooks/userHooks'
import { login } from '../stateMgmt/actions/userActions'

export default function ProfilePage() {
  const { state: { userInfo }, dispatch } = useContext(Store)

  const [name, setName] = useState(userInfo!.name)
  const [email, setEmail] = useState(userInfo!.email)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [isValid, setIsValid] = useState(false)

  const { mutateAsync: updateProfile, isLoading } = useUpdateProfileMutation()

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      // const data = await updateProfile({ name, email, password })
      login(dispatch, (await updateProfile({ name, email, password })))
      toast.success('User updated successfully')
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
  }

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    setIsValid(false)
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

  const blurHandler = () => setIsValid(fn.hasError('profile'))

  const fieldValue = [name, email, password, confirmPassword]
  const userInputs = inputs.signUp.map((input: InputAttr, idx: number) => (
    <FormInput
      form='profile'
      key={input.name}
      type={input.type}
      name={input.name}
      label={input.label}
      value={fieldValue[idx]}
      autoFocus={input.autofocus}
      onChange={e => changeHandler(e, input.name)}
      onBlur={blurHandler}
    />
  ))

  const formButton =
    <Button className='w-100' type="submit" disabled={!isValid && !isLoading}>
      {isLoading ? 'Loading...' : 'Update'}
    </Button>

  return (
    <FormEntry
      title='Profile Update'
      notify=''
      inputs={userInputs}
      formButton={formButton}
      submitHandler={submitHandler}
    />
  )
}
