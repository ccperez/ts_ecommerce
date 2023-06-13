import { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import fn from '../../functions/form'

interface InputProps {
  form: string,
  type: string,
  name: string,
  label: string,
  value: any,
  autoFocus: boolean,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onBlur: any
}

let errors = {}
let passwordValue = ''

export default function Input({ form, type, name, label, value, autoFocus, onChange, onBlur }: InputProps) {
  const [showError, setShowError] = useState(false)
  const [showMeter, setShowMeter] = useState(false)
  const [passwordType, setPasswordType] = useState('password')

  const togglePassword = () =>
    setPasswordType(passwordType === 'password' ? 'text' : 'password')

  const passwordTracker = fn.form.password.tracker(value)
  const passwordStrength = fn.form.password.strength(passwordTracker)

  const passwordValidation = (field: string) =>
    fn.form.password.validation(form, field, showMeter, passwordStrength, passwordTracker)

  const passwordOnFocusHandler = (field: string) => {
    if (field === 'password' || field === 'newPassword') setShowMeter(true)
    if (field === 'confirmPassword') setShowError(true)
  }

  const passwordOnBlurHandler = (field: string) => {
    if (field === 'password' || field === 'newPassword') {
      passwordValue = value
      setShowMeter(false)
    }
    onBlur()
  }

  const formValidation = (type: string, name: string, value: string) => {
    let errorMessage
    switch (type) {
      case 'text':
        const ptrn_Fullname = /^[a-zA-Z]{2,40}( [a-zA-Z]{2,40})+$/
        errorMessage = name === 'name' && !ptrn_Fullname.test(value)
          ? 'Please enter your fullname [first and last name]!' : undefined
        break
      case 'email':
        const ptrn_Email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        errorMessage = !ptrn_Email.test(value)
          ? 'Please enter valid email address!' : undefined
        break
      case 'password':
        switch (true) {
          case name === 'password' || name === 'newPassword':
            errorMessage = (fn.form.password.strengthMeter(passwordStrength)) < 100
              ? 'Please enter valid Password!' : undefined
            break
          case name === 'confirmPassword':
            errorMessage = passwordValue !== value
              ? 'Please enter value that match to the password!' : undefined
        }
    }

    errors = JSON.parse(JSON.stringify({ ...errors, [name]: errorMessage })) // JSON.parse, remove undefined value
    localStorage.setItem(form, JSON.stringify({ errors: errors }))

    return name === 'password' || name === 'newPassword'
      ? passwordValidation(name)
      : showError && <span style={{ color: 'red' }}>{errorMessage}</span>
  }

  const formInput = (type: string) => {
    switch (type) {
      case 'password':
        return (
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
        )
      default:
        return (
          <Form.Control
            required
            autoFocus={autoFocus}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setShowError(true)}
            onBlur={onBlur}
          />
        )
    }
  }

  return (
    <Form.Group className="mb-3" controlId={name}>
      <Form.Label>{label}</Form.Label>
      {name === 'password' || name === 'newPassword' ? formInput('password') : formInput(type)}
      {formValidation(type, name, value)}
    </Form.Group>
  )
}
