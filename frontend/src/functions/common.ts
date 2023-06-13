import { useLocation } from 'react-router-dom'

export default {
  redirect: () => {
    const { search } = useLocation()
    const redirectInUrl = new URLSearchParams(search).get('redirect')
    return redirectInUrl ? redirectInUrl : '/'
  },
  hasError: (form: string) => {
    const { errors } = JSON.parse(localStorage.getItem(form)!)
    return Object.keys(errors).length === 0
  },
}
