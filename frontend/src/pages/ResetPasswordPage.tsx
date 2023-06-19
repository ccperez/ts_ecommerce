import { useState, useContext, useEffect } from 'react'
import { Button } from "react-bootstrap"
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

import FormInput from '../components/form/Input'
import FormEntry from '../components/form/Entry'
import inputs, { InputAttr } from '../user_input_attributes'

import { Store } from '../Store'
import { getError } from '../utils'
import { ApiError } from '../types/ApiError'
import fn from '../functions/common'

import { userPasswordMutation } from '../hooks/userHooks'

export default function ResetPasswordPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [otp, setOTP] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [isValid, setIsValid] = useState(false)
  const [option, setOption] = useState(0)
  const [genOTP, setGenOTP] = useState(0)

  const [timerCount, setTimer] = useState(60)
  const [disable, setDisable] = useState(true)
  const [hasResentOTP, setHasResentOTP] = useState(false)

  const { state: { userInfo } } = useContext(Store)
  const { mutateAsync: resetPassword, isLoading } = userPasswordMutation()

  useEffect(() => {
    if (userInfo) navigate('/')

    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval)
        if (lastTimerCount <= 1) setDisable(false)
        if (lastTimerCount <= 0) {
          if (option === 1) setGenOTP(0)
          return lastTimerCount
        }
        return lastTimerCount - 1
      })
    }, 1000) //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval)
  }, [navigate, userInfo, disable, genOTP])

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    try {
      switch (option) {
        case 0:
          if (!genOTP) {
            const { data } = await resetPassword({ data: `1|${email}|${fn.generateOTP}` })
            setGenOTP(parseInt(data.split('|')[2]))
            setOption(1)
          }
          break
        case 1:
          parseInt(otp) === genOTP
            ? setOption(2)
            : toast.error('Please provide correct OTP!')
          break
        case 2:
          const { data } = await resetPassword({ data: `2|${email}|${newPassword}` })
          if (data) setOption(3)
          break
      }
    } catch (err) {
      toast.error(getError(err as ApiError))
    }
  }

  const resendOTP = async () => {
    const { data } = await resetPassword({ data: `1|${email}|${fn.generateOTP}` })
    const gnOTP = parseInt(data.split('|')[2])
    if (gnOTP) {
      setTimer(60)
      setGenOTP(gnOTP)
      setDisable(true)
      setHasResentOTP(true)
    }
  }

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    setIsValid(false)
    const { value } = e.target
    switch (name) {
      case 'email':
        return setEmail(value)
      case 'otp':
        return setOTP(value)
      case 'newPassword':
        return setNewPassword(value)
      case 'confirmPassword':
        return setConfirmPassword(value)
    }
  }

  const blurHandler = () => setIsValid(fn.hasError('resetPassword'))

  const inputProcess = () => {
    switch (option) {
      case 0:
        return (
          <FormInput
            form='resetPassword'
            type='email'
            name='email'
            label='Enter your email address'
            value={email}
            autoFocus={true}
            onChange={(e) => changeHandler(e, 'email')}
            onBlur={blurHandler}
          />
        )
      case 1:
        return (
          <FormInput
            form='resetPassword'
            type='number'
            name='otp'
            label={`Enter OTP that received from email (${fn.emailProtect(email)})`}
            value={otp}
            autoFocus={true}
            onChange={(e) => changeHandler(e, 'otp')}
            onBlur={blurHandler}
          />
        )
      case 2:
        const fieldValue = [newPassword, confirmPassword]
        return inputs.resetPassword.map((input: InputAttr, idx: number) => (
          <FormInput
            form='resetPassword'
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
      case 3:
        return (
          <p>
            <br />
            <h3 style={{ color: 'green', textAlign: 'center' }}>
              Congratulation! You successfully reset your password. Try to login now
            </h3>
            <br />
          </p>
        )
    }
  }

  const resendOTPMessage =
    <div className='flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500'>
      <br />
      <hr />
      <p>Didn't receive the OTP?</p>{' '}
      <a
        className='flex flex-row items-center'
        style={{
          color: disable ? 'gray' : 'blue',
          cursor: disable ? 'none' : 'pointer',
          textDecorationLine: disable ? 'none' : 'underline',
        }}
        onClick={() => resendOTP()}
      >
        {disable ? `Resend OTP in ${timerCount}s` : 'Resend OTP'}
      </a>

      {disable && hasResentOTP && <p style={{ color: 'green', textAlign: 'center' }}>
        <br />New OTP successfully sent to your email ({fn.emailProtect(email)})
      </p>}
      {(genOTP === 0) && <p style={{ color: 'red', textAlign: 'center' }}>
        <br />OTP expired! click resend OTP, to get a new one
      </p>}
    </div>

  const formButton = (option < 3)
    ? <>
      <Button className='w-100' type="submit" disabled={!isValid && !isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </Button>
      {option === 1 && resendOTPMessage}
    </>
    : <span />

  return (
    <FormEntry
      title="Reset Password"
      notify=""
      inputs={inputProcess()}
      formButton={formButton}
      submitHandler={submitHandler}
    />
  )
}
