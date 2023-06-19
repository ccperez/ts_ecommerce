import { Col, Row } from 'react-bootstrap'

interface iCheckoutSteps {
  step1?: boolean
  step2?: boolean
  step3?: boolean
  step4?: boolean
}

export default function CheckoutSteps({ step1, step2, step3, step4 }: iCheckoutSteps) {
  return (
    <Row className="checkout-steps">
      <Col className={step1 ? 'active' : ''}>Sign-In</Col>
      <Col className={step2 ? 'active' : ''}>Shipping</Col>
      <Col className={step3 ? 'active' : ''}>Payment</Col>
      <Col className={step4 ? 'active' : ''}>Place Order</Col>
    </Row>
  )
}