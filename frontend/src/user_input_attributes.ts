export type InputAttr = {
  type: string
  name: string
  label: string
}

const userInputAttributes = {
  signIn: [
    {
      type: 'email',
      name: 'email',
      label: 'Email Address',
    },
    {
      type: 'password',
      name: 'password',
      label: 'Password',
    },
  ],
  signUp: [
    {
      type: 'text',
      name: 'name',
      label: 'Name',
    },
    {
      type: 'email',
      name: 'email',
      label: 'Email Address',
    },
    {
      type: 'password',
      name: 'password',
      label: 'Password',
    },
    {
      type: 'password',
      name: 'confirmPassword',
      label: 'Confirm Password',
    },
  ],
}

export default userInputAttributes
