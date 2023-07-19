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

  const passwordTracker =
    (name === 'password' || name === 'newPassword')
      ? fn.form.password.tracker(value) : null

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
        if (form !== 'editProduct') {
          if (name === 'name' || name === 'fullName') {
            const ptrn_Fullname = /^[a-zA-Z]{2,40}( [a-zA-Z]{2,40})+$/
            errorMessage = !ptrn_Fullname.test(value)
              ? 'Please enter your fullname [first and last name]!' : undefined
          } else if (name === 'address') {
            const ptrn_Address = /^(\d+) ?([A-Za-z](?= ))? (.*?) ([^ ]+?) ?((?<= )APT)? ?((?<= )\d*)?$/
            errorMessage = !ptrn_Address.test(value)
              ? 'Please enter valid address!' : undefined
          } else if (name === 'city') {
            const ptrn_City = /^[a-zA-Z ]{1,19}$/
            errorMessage = !ptrn_City.test(value)
              ? 'Please enter valid city!' : undefined
          } else if (name === 'postalCode') {
            const ptrn_PostalCode = /^\d{4}$/
            errorMessage = !ptrn_PostalCode.test(value)
              ? 'Please enter valid postalcode!' : undefined
          } else if (name === 'country') {
            const ptrn_Country = /^[a-zA-Z ]{1,19}$/
            errorMessage = !ptrn_Country.test(value)
              ? 'Please enter valid country!' : undefined
          }
        } else {
          if (name === 'name' || name === 'category' || name === 'brand' || name === 'description') {
            const ptrn_product = /^[\w ]*[^\W_][\w ]*$/
            errorMessage = !ptrn_product.test(value)
              ? `Please enter valid product ${name}!` : undefined
          } else if (name === 'slug') {
            const ptrn_slug = /^[A-Za-z0-9\-\_]+$/
            errorMessage = !ptrn_slug.test(value)
              ? 'Please enter valid product slug!' : undefined
          } else if (name === 'image') {
            const ptrn_filename = /[^\s]+(.*?).(jpg|jpeg|png|gif)$/
            errorMessage = !ptrn_filename.test(value)
              ? 'Please enter valid image filename with (jpg|jpeg|png|gif) extension!' : undefined
          }
        }
        break
      case 'number':
        if (name === 'otp') {
          const ptrn_OTP = /^\d{6}$/
          errorMessage = name === 'otp' && !ptrn_OTP.test(value)
            ? 'Please provide right OTP pattern!' : undefined
        } else if (name === 'price') {
          const ptrn_price = /^[0-9]*(\.[0-9]{0,2})?$/
          errorMessage = !ptrn_price.test(value)
            ? 'Please provide proper price' : undefined
        } else if (name === 'countInStock') {
          const ptrn_stock = /^\d+$/
          errorMessage = !ptrn_stock.test(value)
            ? 'Please provide proper stock count!' : undefined
        }
        break
      case 'email':
        const ptrn_Email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        errorMessage = !ptrn_Email.test(value)
          ? 'Please enter valid email address!' : undefined
        break
      case 'password':
        if (name === 'password' || name === 'newPassword') {
          errorMessage = (fn.form.password.strengthMeter(passwordStrength)) < 100
            ? 'Please enter valid Password!' : undefined
        } else if (name === 'confirmPassword') {
          errorMessage = passwordValue !== value
            ? 'Please enter value that match to the password!' : undefined
        }
    }

    if (!errors.hasOwnProperty('form')) {
      localStorage.removeItem(form)
      errors = { form: form }
    }

    if (Object.keys(errors).length > 1 && form !== Object.values(errors)[0]) {
      localStorage.removeItem(Object.values(errors)[0] as string)
      errors = { form: form }
    }

    // JSON.parse, remove undefined value
    errors = JSON.parse(JSON.stringify({ ...errors, [name]: errorMessage }))
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
            required={!(type === 'file')}
            disabled={(name === 'image')}
            multiple={(type === 'file')}
            autoFocus={autoFocus}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setShowError(true)
            }
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
