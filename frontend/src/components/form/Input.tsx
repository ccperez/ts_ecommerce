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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Input({ form, type, name, label, value, autoFocus, onChange }: InputProps) {
  const [meter, setMeter] = useState(false)
  const [passwordType, setPasswordType] = useState('password')

  const togglePassword = () =>
    setPasswordType(passwordType === 'password' ? 'text' : 'password')

  const passwordTracker = fn.form.password.tracker(value)
  const passwordStrength = fn.form.password.strength(passwordTracker)

  const passwordValidation = (field: string) =>
    fn.form.password.validation(form, field, meter, passwordStrength, passwordTracker)

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
              onFocus={() => setMeter(true)}
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
          />
        )
    }
  }

  return (
    <>
      <Form.Group className="mb-3" controlId={name}>
        <Form.Label>{label}</Form.Label>
        {name === 'password' || name === 'newPassword' ? (
          formInput('password')
        ) : (
          formInput(type)
        )}
      </Form.Group>
      {passwordValidation(name)}
    </>
  )
}
