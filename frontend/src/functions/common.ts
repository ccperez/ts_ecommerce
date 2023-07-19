import { useLocation } from 'react-router-dom'

const getForm = (form: string) => JSON.parse(localStorage.getItem(form)!)

export default {
  redirect: () => {
    const { search } = useLocation()
    const redirectInUrl = new URLSearchParams(search).get('redirect')
    return redirectInUrl ? redirectInUrl : '/'
  },
  hasError: (form: string) => {
    const { errors } = getForm(form)
    return Object.keys(errors).length === 1
  },
  generateOTP: Math.floor(Math.random() * 900000 + 100000),
  clearFormErrors: () => {
    if (getForm('signIn')) localStorage.removeItem('signIn')
    if (getForm('signUp')) localStorage.removeItem('signUp')
    if (getForm('resetPassword')) localStorage.removeItem('resetPassword')
    if (getForm('shipping')) localStorage.removeItem('shipping')
    if (getForm('profile')) localStorage.removeItem('profile')
  },
  emailProtect: (email: string) =>
    email.replace(/(\w{2})[\w.-]+@([\w.]+\w)/, '$1****@$2'),
  baseURL: import.meta.env.DEV ? 'http://localhost:5000/' : '/',
}
