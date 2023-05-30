import Alert from 'react-bootstrap/Alert'

const Message = (
	{ variant = 'info', children }: { variant?: string, children: React.ReactNode }
) => <Alert variant={variant || 'info'}>{children}</Alert>

export default Message
