import { Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'

interface iCheckout {
  title: string,
  CheckoutSteps: JSX.Element,
  submitHandler: (e: React.SyntheticEvent) => void,
  userInputs: JSX.Element[] | any,
  formButton: JSX.Element
}

export default function Checkout({ title, CheckoutSteps, submitHandler, userInputs, formButton }: iCheckout) {
  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {CheckoutSteps}
      <div className="container small-container">
        <h1 className="my-3">{title}</h1>
        <Form onSubmit={submitHandler}>
          {userInputs}
          <div className="mb-3">
            {formButton}
          </div>
        </Form>
      </div>
    </div>
  )
}
