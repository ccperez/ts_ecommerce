import { Button, Modal } from 'react-bootstrap'

interface pConfirmation {
  showModal: boolean
  hideModal: any
  confirmModal: any
  deleteItem?: string
  title: string
  message: string
}

export default function PromptConfirmation({ showModal, hideModal, confirmModal, deleteItem, title, message }: pConfirmation) {
  return (
    <Modal show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title} Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body><div className="alert alert-danger">{message}</div></Modal.Body>
      <Modal.Footer>
        <Button variant="default" onClick={hideModal}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => confirmModal(deleteItem)}>
          {title}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
