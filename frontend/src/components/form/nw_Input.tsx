import { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { PasswordStrengthMeter } from '../../styled/components'
import fn from '../../functions/form'

interface InputProps {
  form: string,
  type: string,
  name: string,
  label: string,
  value: any,
  autoFocus: boolean,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
}

let errors = {}
let passwordValue = ''

export default function Input({ form, type, name, label, value, autoFocus, onChange, onBlur }: InputProps) {
  const [validate, setValidate] = useState(false)
  const [meter, setMeter] = useState(false)
  const [passwordType, setPasswordType] = useState('password')

  const togglePassword = () =>
    setPasswordType(passwordType === 'password' ? 'text' : 'password')

  const passwordOnFocusHandler = (field: string) => {
    if (field === 'password' || field === 'newPassword') setMeter(true)
    if (field === 'confirmPassword') setValidate(true)
  }

  const passwordOnBlurHandler = (field: string) => {
    if (field === 'password' || field === 'newPassword') {
      passwordValue = value
      setMeter(false)
    }
  }

  const formValidation = (type: string, name: string, value: string) => {
    let errorColor = 'red', errorMessage, pswrdMtrWdth = 0

    const passwordTracker = fn.form.password.tracker(value) || null
    const passwordStrength = fn.form.password.strength(passwordTracker)

    switch (type) {
      case 'text':
        const ptrn_Fullname = /^[a-zA-Z]{2,40}( [a-zA-Z]{2,40})+$/
        errorMessage = name === 'name' && !ptrn_Fullname.test(value)
          ? 'Please enter your full name [first and last name]!' : undefined
        break
      case 'email':
        const ptrn_Email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        errorMessage = name === 'email' && !ptrn_Email.test(value)
          ? 'Please enter valid email address!' : undefined
        break
      case 'password':
        switch (true) {
          case name === 'password' || name === 'newPassword':
            const pswrdVldtn = fn.form.password.validation(passwordStrength)

            pswrdMtrWdth = pswrdVldtn.width
            errorColor = pswrdVldtn.color
            errorMessage = pswrdMtrWdth < 100 ? 'Please enter valid password!' : undefined

            break
          case name === 'confirmPassword':
            errorMessage = passwordValue !== value
              ? 'Please enter value that match to the password!' : undefined
            break
        }
    }

    errors = JSON.parse(JSON.stringify({ ...errors, [name]: errorMessage }))
    localStorage.setItem(form, JSON.stringify({ errors: errors }))

    return name === 'password' || name === 'newPassword'
      ? passwordTracker && meter && (form !== 'signIn') &&
      <>
        <PasswordStrengthMeter className='password-strength-meter' color={errorColor} width={pswrdMtrWdth} />
        <span style={{ color: errorColor }}>
          {passwordStrength < 5 && 'Must contain '}
          {!passwordTracker.uppercase && 'uppercase, '}
          {!passwordTracker.lowercase && 'lowercase, '}
          {!passwordTracker.specialChar && 'special character, '}
          {!passwordTracker.number && 'number, '}
          {!passwordTracker.eightCharsOrGreater && 'eight characters or more'}
        </span>
      </>
      : validate && <span style={{ color: errorColor }}>{errorMessage}</span>
  }

  const formInput = (type: string) => {
    switch (type) {
      case 'password':
        return (
          <>
            <InputGroup>
              <Form.Control
                required
                autoFocus={autoFocus}
                type={passwordType}
                value={value}
                onChange={onChange}
                onFocus={() => passwordOnFocusHandler(name)}
                onBlur={() => passwordOnBlurHandler(name)}
              />
              <Button onClick={togglePassword}>
                <i
                  className={
                    passwordType === 'password'
                      ? 'fa fa-eye-slash'
                      : 'fa fa-eye'
                  }
                />
              </Button>
            </InputGroup>
            {formValidation(type, name, value)}
          </>
        )
      default:
        return (
          <>
            <Form.Control
              required
              autoFocus={autoFocus}
              type={type}
              value={value}
              onChange={onChange}
              onFocus={() => setValidate(true)}
              onBlur={onBlur}
            />
            {formValidation(type, name, value)}
          </>
        )
    }
  }

  return (
    <Form.Group className="mb-3" controlId={name}>
      <Form.Label>{label}</Form.Label>
      {name === 'password' || name === 'newPassword' ? (
        formInput('password')
      ) : (
        formInput(type)
      )}
    </Form.Group>
  )
}
