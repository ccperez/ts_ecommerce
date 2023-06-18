import { Helmet } from "react-helmet-async";
import { Link } from 'react-router-dom'
import { Col, Container, Form, Row } from "react-bootstrap";
import fn from '../../functions/common'

interface EntryProps {
  title: string,
  notify: string,
  inputs: JSX.Element[] | any,
  formButton: JSX.Element,
  submitHandler: (e: React.SyntheticEvent) => Promise<void>,
}

export default function Entry({ title, notify, inputs, formButton, submitHandler }: EntryProps) {
  const redirect = fn.redirect()
  const redirectUrl = title.includes('In')
    ? `/signup?redirect=${redirect}`
    : `/signin?redirect=${redirect}`

  const formLinks = (form: String) => {
    form = form.toLowerCase().replace(/\s+/g, '')
    switch (true) {
      case form.includes('sign'):
        return (
          <Row className='mb-3'>
            <Col className={title.includes('Up') ? 'text-center' : ''}>
              {notify}?{' '}
              <Link to={redirectUrl}>Sign {title.includes('In') ? 'Up' : 'In'}</Link>
            </Col>
            {title.includes('In') && (
              <Col className='d-flex flex-column align-items-end'>
                <Link to='/reset_password'>Forgot your password?</Link>
              </Col>
            )}
          </Row>
        )
      case form === 'resetpassword':
        return (
          <Row className='mb-3'>
            <Col>
              <Link to='/signin?redirect=/'>Already have an account?</Link>
            </Col>
            <Col className='d-flex flex-column align-items-end'>
              <Link to='/signup?redirect=/'>New customer?</Link>
            </Col>
          </Row>
        )
    }
  }

  return (
    <Container className="small-container">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <h1 className="my-3 text-center text-capitalize">{title}</h1>
      <Form onSubmit={submitHandler}>
        {inputs}
        <div className="mb-3">
          {formButton}
        </div>
        <hr />
        {formLinks(title)}
      </Form>
    </Container>
  )
}
