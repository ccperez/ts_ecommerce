export type InputAttr = {
  type: string
  name: string
  label: string
  autofocus: boolean
}

const userInputAttributes = {
  signIn: [
    {
      type: 'email',
      name: 'email',
      label: 'Email Address:',
      autofocus: true,
    },
    {
      type: 'password',
      name: 'password',
      label: 'Password:',
      autofocus: false,
    },
  ],
  signUp: [
    {
      type: 'text',
      name: 'name',
      label: 'Fullname:',
      autofocus: true,
    },
    {
      type: 'email',
      name: 'email',
      label: 'Email Address:',
      autofocus: false,
    },
    {
      type: 'password',
      name: 'password',
      label: 'Password:',
      autofocus: false,
    },
    {
      type: 'password',
      name: 'confirmPassword',
      label: 'Confirm Password:',
      autofocus: false,
    },
  ],
  resetPassword: [
    {
      type: 'password',
      name: 'newPassword',
      label: 'New Password:',
      autofocus: true,
    },
    {
      type: 'password',
      name: 'confirmPassword',
      label: 'Confirm Password:',
      autofocus: false,
    },
  ],
}

export default userInputAttributes
