import { useState, useContext, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import { Store } from '../Store'
import { ApiError } from '../types/ApiError'
import { getError } from '../utils'
import { useSigninMutation } from '../hooks/userHooks'

export default function SignInPage() {
	const navigate = useNavigate()
	const { search } = useLocation()
	const redirectInUrl = new URLSearchParams(search).get('redirect')
	const redirect = redirectInUrl ? redirectInUrl : '/'

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const { state: { userInfo }, dispatch } = useContext(Store)

	const { mutateAsync: signin, isLoading } = useSigninMutation()

	const submitHandler = async (e: React.SyntheticEvent) => {
		e.preventDefault()
		try {
			const data = await signin({ email, password })
			dispatch({ type: 'USER_SIGNIN', payload: data })
			localStorage.setItem('userInfo', JSON.stringify(data))
			navigate(redirect)
		} catch (err) {
			toast.error(getError(err as ApiError))
		}
	}

	useEffect(() => {
		if (userInfo) navigate(redirect)
	}, [navigate, userInfo, redirect])

	return (
		<Container className="small-container">
			<Helmet>
				<title>Sign In</title>
			</Helmet>
			<h1 className="my-3">Sign In</h1>
			<Form onSubmit={submitHandler}>
				<Form.Group className="mb-3" controlId="email">
					<Form.Label>Email</Form.Label>
					<Form.Control
						type="email"
						required
						onChange={(e) => setEmail(e.target.value)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="password">
					<Form.Label>Password</Form.Label>
					<Form.Control
						type="password"
						required
						onChange={(e) => setPassword(e.target.value)}
					/>
				</Form.Group>
				<div className="mb-3">
					<Button disabled={isLoading} type="submit">
						Sign In
					</Button>
					{isLoading && <Loading />}
				</div>
				<div className="mb-3">
					New customer?{' '}
					<Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
				</div>
			</Form>
		</Container>
	)
}