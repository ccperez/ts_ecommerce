import { useContext } from 'react'
import { Badge, Button, Container, Nav, Navbar } from 'react-bootstrap'
import { Link, Outlet } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Store } from './Store'
import fn from './functions/cart'

function App() {
	const { state: { mode, cart }, dispatch } = useContext(Store)

	const switchModeHandler = () => {
		document.body.setAttribute('data-bs-theme', mode)
		dispatch({ type: 'SWITCH_MODE' })
	}

	return (
		<div className="d-flex flex-column vh-100">
			<ToastContainer position="bottom-center" limit={1} />
			<header>
				<Navbar expand="lg">
					<Container>
						<LinkContainer to="/">
							<Navbar.Brand>tsamazona</Navbar.Brand>
						</LinkContainer>
					</Container>
					<Nav>
						<Button variant={mode} onClick={switchModeHandler}>
							<i className={mode === 'light' ? 'fa fa-sun' : 'fa fa-moon'}></i>
						</Button>
						<Link to="/cart" className="nav-link">
							Cart
						</Link>
						{cart.cartItems.length > 0 && (
							<Badge pill bg="danger">
								{fn.cart.totalItems(cart.cartItems)}
							</Badge>
						)}
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
