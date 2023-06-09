import { useLocation } from 'react-router-dom'

export default {
  redirect: () => {
    const { search } = useLocation()
    const redirectInUrl = new URLSearchParams(search).get('redirect')
    return redirectInUrl ? redirectInUrl : '/'
  },
}
