import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay } from "@chakra-ui/react"

const ModalBox = ({isOpen, onClose, element}) => {
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} isCentered size={"3xl"}>
                <ModalOverlay />
                <ModalContent>
                    <ModalBody p={10}>
                        {element}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant={"ghost"} onClick={onClose} _focus={{ outline: "none" }}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ModalBox;