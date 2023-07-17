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
  productUpdate: [
    {
      type: 'text',
      name: 'name',
      label: 'Name',
      autofocus: true,
    },
    {
      type: 'text',
      name: 'slug',
      label: 'Slug',
      autofocus: false,
    },
    {
      type: 'number',
      name: 'price',
      label: 'Price',
      autofocus: false,
    },
    {
      type: 'text',
      name: 'category',
      label: 'Category',
      autofocus: false,
    },
    {
      type: 'text',
      name: 'brand',
      label: 'Brand',
      autofocus: false,
    },
    {
      type: 'number',
      name: 'countInStock',
      label: 'Count In Stock',
      autofocus: false,
    },
    {
      type: 'text',
      name: 'description',
      label: 'Description',
      autofocus: false,
    },
    {
      type: 'text',
      name: 'image',
      label: 'Image',
      autofocus: false,
    },
    {
      type: 'file',
      name: 'imageFile',
      label: 'Image File',
      autofocus: false,
    },
  ],
}

export default userInputAttributes
