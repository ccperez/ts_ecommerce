import { Form } from 'react-bootstrap'

interface InputProps {
	type: string,
	name: string,
	label: string,
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Input({ type, name, label, onChange }: InputProps) {
	return (
		<Form.Group className="mb-3" controlId={name}>
			<Form.Label>{label}</Form.Label>
			<Form.Control
				required
				type={type}
				onChange={onChange}
			/>
		</Form.Group>
	)
}
