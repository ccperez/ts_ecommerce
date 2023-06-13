import { useState } from 'react'
import { Helmet } from "react-helmet-async"
import { Link } from 'react-router-dom'
import { Button, Col, Container, Form, Row } from "react-bootstrap"

import FormInput from '../components/form/Input'

export default function ResetPasswordPage() {
  const isLoading = false, option = 0

  const [email, setEmail] = useState('')

  const submitHandler = () => { }

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
            onChange={(e) => setEmail(e.target.value)}
            onBlur={console.log('onBlur')}
          />
        )
    }
  }

  return (
    <Container className="small-container">
      <Helmet>
        <title>Reset Password</title>
      </Helmet>
      <h1 className="my-3 text-center text-capitalize">Reset Password</h1>
      <Form onSubmit={submitHandler}>
        <br />
        {inputProcess()}
        <div className="mb-3">
          <Button className='w-100' type="submit" disabled={!isLoading}>
            {isLoading ? 'Loading...' : 'Submit'}
          </Button>
        </div>
        <hr />
        <Row className='mb-3'>
          <Col>
            <Link to='/signin?redirect=/'>Already have an account?</Link>
          </Col>
          <Col className='d-flex flex-column align-items-end'>
            <Link to='/signup?redirect=/'>New customer?</Link>
          </Col>
        </Row>
      </Form>
    </Container>
  )
}
