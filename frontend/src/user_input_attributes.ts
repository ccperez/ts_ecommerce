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
  shipping: [
    {
      type: 'text',
      name: 'fullName',
      label: 'Fullname',
      autofocus: true,
    },
    {
      type: 'text',
      name: 'address',
      label: 'Address',
      autofocus: false,
    },
    {
      type: 'text',
      name: 'city',
      label: 'City',
      autofocus: false,
    },
    {
      type: 'text',
      name: 'postalCode',
      label: 'Postal Code',
      autofocus: false,
    },
    {
      type: 'text',
      name: 'country',
      label: 'Country',
      autofocus: false,
    },
  ],
}

export default userInputAttributes
