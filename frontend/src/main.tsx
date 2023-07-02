import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import 'bootstrap/dist/css/bootstrap.min.css'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import App from './App.tsx'
import './index.css'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ProfilePage from './pages/ProfilePage'
import ShippingAddressPage from './pages/ShippingAddressPage'
import PaymentMethodPage from './pages/PaymentMethodPage'
import PlaceOrderPage from './pages/PlaceOrderPage'
import OrderPage from './pages/OrderPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import ProtectedRoute from './components/ProtectedRoute'
import { StoreProvider } from './Store'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} element={<HomePage />} />
      <Route path="product/:slug" element={<ProductPage />} />
      <Route path="cart" element={<CartPage />} />

      <Route path="signin" element={<SignInPage />} />
      <Route path="signup" element={<SignUpPage />} />
      <Route path="reset_password" element={<ResetPasswordPage />} />

      <Route path="" element={<ProtectedRoute />}>
        <Route path="shipping" element={<ShippingAddressPage />} />
        <Route path="payment" element={<PaymentMethodPage />} />
        <Route path="placeorder" element={<PlaceOrderPage />} />
        <Route path="/order/:id" element={<OrderPage />} />
        <Route path="orderhistory" element={<OrderHistoryPage />} />

        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Route>
  )
)

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <PayPalScriptProvider options={{ 'client-id': 'sb' }} deferLoading={true}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
          </QueryClientProvider>
        </HelmetProvider>
      </PayPalScriptProvider>
    </StoreProvider>
  </React.StrictMode>
)
