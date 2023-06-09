import { Helmet } from "react-helmet-async";
import { Link } from 'react-router-dom'
import { Container, Form } from "react-bootstrap";
import fn from '../../functions/common'

interface EntryProps {
	title: string,
	notify: string,
	inputs: JSX.Element[],
	formButton: JSX.Element,
	submitHandler: (e: React.SyntheticEvent) => Promise<void>,
}

export default function Entry({ title, notify, inputs, formButton, submitHandler }: EntryProps) {
	const redirect = fn.redirect()
	const redirectUrl = title.includes('In')
		? `/signup?redirect=${redirect}`
		: `/signin?redirect=${redirect}`

	return (
		<Container className="small-container">
			<Helmet>
				<title>{title}</title>
			</Helmet>
			<h1 className="my-3 text-center">{title}</h1>
			<Form onSubmit={submitHandler}>
				{inputs}
				<div className="mb-3">
					{formButton}
				</div>
				<div className="mb-3 text-center">
					{notify}?{' '}
					<Link to={redirectUrl}>Sign{title.includes('In') ? ' Up' : ' In'}</Link>
				</div>
			</Form>
		</Container>
	)
}
