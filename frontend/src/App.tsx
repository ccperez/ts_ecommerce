import { useContext } from 'react'
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import { Store } from './Store'

function App() {
	const { state: { mode }, dispatch } = useContext(Store)

	const switchModeHandler = () => {
		document.body.setAttribute('data-bs-theme', mode)
		dispatch({ type: 'SWITCH_MODE' })
	}

	return (
		<div className="d-flex flex-column vh-100">
			<header>
				<Navbar expand="lg">
					<Container>
						<Navbar.Brand>tsamazona</Navbar.Brand>
					</Container>
					<Nav>
						<Button variant={mode} onClick={switchModeHandler}>
							<i className={mode === 'light' ? 'fa fa-sun' : 'fa fa-moon'}></i>
						</Button>
						<a href="/cart" className="nav-link">
							Cart
						</a>
						<a href="/signin" className="nav-link">
							Sign In
						</a>
					</Nav>
				</Navbar>
			</header>
			<main>
				<Container className="mt-3">
					<Outlet />
				</Container>
			</main>
			<div className="text-center">All rights reserved</div>
		</div>
	)
}

export default App
