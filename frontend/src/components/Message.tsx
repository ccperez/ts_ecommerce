import Alert from 'react-bootstrap/Alert'

interface MessageProps {
	variant?: string, children: React.ReactNode
}

export default function Message({ variant = 'info', children }: MessageProps) {
	return <Alert variant={variant}>{children}</Alert>
}
