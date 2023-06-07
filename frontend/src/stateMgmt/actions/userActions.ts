export const logout = () => {
	localStorage.removeItem('userInfo')
	localStorage.removeItem('cartItems')
	localStorage.removeItem('shippingAddress')
	localStorage.removeItem('paymentMethod')

	window.location.href = '/signin'
}