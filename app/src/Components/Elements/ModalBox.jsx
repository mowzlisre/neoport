import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay } from "@chakra-ui/react"

const ModalBox = ({isOpen,element, size}) => {
    return (
        <>
            <Modal isOpen={isOpen} isCentered size={size}>
                <ModalOverlay />
                <ModalContent>
                    <ModalBody p={5}>
                        {element}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ModalBox;