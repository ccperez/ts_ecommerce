import { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'

interface InputProps {
  type: string,
  name: string,
  label: string,
  value: any,
  autoFocus: boolean,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Input({ type, name, label, value, autoFocus, onChange }: InputProps) {
  const [passwordType, setPasswordType] = useState('password')

  const togglePassword = () =>
    setPasswordType(passwordType === 'password' ? 'text' : 'password')

  const formInput = (type: string) => {
    switch (type) {
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
    <Form.Group className="mb-3" controlId={name}>
      <Form.Label>{label}</Form.Label>
      {name === 'password' ? (
        <InputGroup>
          <Form.Control
            required
            autoFocus={autoFocus}
            type={passwordType}
            value={value}
            onChange={onChange}
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
      ) : (
        formInput(type)
      )}
    </Form.Group>
  )
}
