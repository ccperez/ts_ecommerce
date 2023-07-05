import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap'

export default function Search() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault()
    navigate(`/search${query ? '?query=' + query : ''}`)
  }

  return (
    <Form className="flex-grow-1 d-flex me-auto" onSubmit={submitHandler}>
      <InputGroup>
        <FormControl
          type="text"
          name="q"
          id="q"
          placeholder="Search Amazona"
          aria-label="Search Amazona"
          aria-describedby="button-search"
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="outline-primary" type="submit" id="button-search">
          <i className="fas fa-search" />
        </Button>
      </InputGroup>
    </Form>
  )
}
