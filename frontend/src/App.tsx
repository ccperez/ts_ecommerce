import { useContext, useState } from 'react'
import { Button, Container, ListGroup, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { Link, Outlet } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Search from './components/form/Search'
import Loading from './components/Loading'
import Message from './components/Message'

import { Store } from './Store'
import { getError } from './utils'
import { ApiError } from './types/ApiError'
import fn from './functions/cart'

import { logout } from './stateMgmt/actions/userActions'
import { useGetCategoriesQuery } from './hooks/productHooks'

function App() {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false)

  const { state: { mode, cart, userInfo }, dispatch } = useContext(Store)

  const { data: categories, isLoading, error } = useGetCategoriesQuery()

  const switchModeHandler = () => {
    document.body.setAttribute('data-bs-theme', mode)
    dispatch({ type: 'SWITCH_MODE' })
  }

  const signoutHandler = () => logout(dispatch)

  const searchCategory = (category: any): { pathname: string, search: string } => {
    return { pathname: '/search', search: `category=${category}` }
  }

  return (
    <div className="d-flex flex-column vh-100">
      <ToastContainer position="bottom-center" limit={1} />
      <header>
        <Navbar
          className="d-flex flex-column align-items-stretch p-2 pb-0 mb-3"
          bg="dark"
          variant="dark"
          expand="lg"
        >
          <div className="d-flex justify-content-between align-items-center">
            <LinkContainer to="/" className="header-link">
              <Navbar.Brand>amazona</Navbar.Brand>
            </LinkContainer>
            <Search />
            <Navbar.Collapse>
              <Nav className="w-100 justify-content-end">
                <Link
                  to="#"
                  className="nav-link header-link"
                  onClick={switchModeHandler}
                >
                  <i className={mode === 'light' ? 'fa fa-sun' : 'fa fa-moon'} />{' '}
                  {mode === 'light' ? 'Light' : 'Dark'}
                </Link>
                {userInfo ? (
                  <NavDropdown className="header-link" title={userInfo.isAdmin ? 'Admin' : `Hello, ${userInfo.name}`} >
                    {userInfo.isAdmin ? (
                      <>
                        <LinkContainer to="/admin/dashboard">
                          <NavDropdown.Item>Dashboard</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/admin/products">
                          <NavDropdown.Item>Products</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/admin/orders">
                          <NavDropdown.Item>Orders</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/admin/users">
                          <NavDropdown.Item>Users</NavDropdown.Item>
                        </LinkContainer>
                      </>
                    ) : (
                      <>
                        <LinkContainer to="/profile">
                          <NavDropdown.Item>User Profile</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/orderhistory">
                          <NavDropdown.Item>Order History</NavDropdown.Item>
                        </LinkContainer>
                      </>
                    )}
                    <>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        {' '}
                        Sign Out{' '}
                      </Link>
                    </>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link header-link" to="/signin">
                    Sign In
                  </Link>
                )}

                {cart.cartItems.length > 0 && (
                  <Link to="/cart" className="nav-link header-link p-0">
                    {
                      <span className="cart-badge">
                        {fn.cart.totalItems(cart.cartItems)}
                      </span>
                    }
                    <svg
                      fill="#ffffff"
                      viewBox="130 150 200 300"
                      width="40px"
                      height="40px"
                    >
                      <path d="M 110.164 188.346 C 104.807 188.346 100.437 192.834 100.437 198.337 C 100.437 203.84 104.807 208.328 110.164 208.328 L 131.746 208.328 L 157.28 313.233 C 159.445 322. 131 
  167.197 328.219 176.126 328.219 L 297.409 328.219 C 306.186 328.219 313.633 322.248 315.951 313.545 L 341.181 218.319 L 320.815 218.319 L 297.409 308.237 L 176.126 308.237 L 150.
  592 203.332 C 148.426 194.434 140.675 188.346 131.746 188.346 L 110.164 188.346 Z M 285.25 328.219 C 269.254 328.219 256.069 341.762 256.069 358.192 C 256.069 374.623 269.254 388.
  165 285.25 388.165 C 301.247 388.165 314.431 374.623 314.431 358.192 C 314.431 341.762 301.247 328.219 285.25 328.219 Z M 197.707 328.219 C 181.711 328.219 168.526 341.762 168.526 
  358.192 C 168.526 374.623 181.711 388.165 197.707 388.165 C 213.704 388.165 226.888 374.623 226.888 358.192 C 226.888 341.762 213.704 328.219 197.707 328.219 Z M 197.707 348.201 C 
  203.179 348.201 207.434 352.572 207.434 358.192 C 207.434 363.812 203.179 368.183 197.707 368.183 C 192.236 368.183 187.98 363.812 187.98 358.192 C 187.98 352.572 192.236 348.201 
  197.707 348.201 Z M 285.25 348.201 C 290.722 348.201 294.977 352.572 294.977 358.192 C 294.977 363.812 290.722 368.183 285.25 368.183 C 279.779 368.183 275.523 363.812 275.523 358.
  192 C 275.523 352.572 279.779 348.201 285.25 348.201 Z" />
                    </svg>
                    <span>Cart</span>
                  </Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </div>
          <div className="sub-header">
            <div className="d-flex">
              <Link
                to="#"
                className="nav-link header-link p-1"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars" /> All
              </Link>
              {['Todays Deal', 'Gifts', 'On Sale'].map((x) => (
                <Link
                  key={x}
                  className="nav-link header-link p-1 px-3"
                  to={`/search?tag=${x}`}
                >
                  {x}
                </Link>
              ))}
            </div>
          </div>
        </Navbar>
      </header>

      {sidebarIsOpen && (
        <div
          className="side-navbar-backdrop"
          onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
        />
      )}
      <div
        className={`
          side-navbar d-flex justify-content-between flex-wrap flex-column
          ${sidebarIsOpen ? ' active-nav' : ''}
        `}
      >
        <ListGroup variant="flush">
          <ListGroup.Item action className="side-navbar-user">
            <LinkContainer
              to={userInfo ? `/profile` : `/signin`}
              onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
            >
              <span>
                {`Hello,  ${userInfo ? userInfo.name : 'enjoy shopping...'}`}
              </span>
            </LinkContainer>
          </ListGroup.Item>
          <ListGroup.Item>
            <div className="d-flex justify-content-between align-items-center">
              <strong>Categories</strong>
              <Button
                variant={mode}
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fa fa-times" />
              </Button>
            </div>
          </ListGroup.Item>
          {isLoading ? (
            <Loading />
          ) : error ? (
            <Message variant="danger">{getError(error as ApiError)}</Message>
          ) : (
            categories!.map(category => (
              <ListGroup.Item action key={category}>
                <LinkContainer
                  to={searchCategory(category)}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </div>

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
