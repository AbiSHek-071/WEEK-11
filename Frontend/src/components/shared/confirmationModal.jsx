// ConfirmationModal.js
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

function ConfirmationModal({
  isOpen,
  onOpenChange,
  title,
  message,
  onConfirm,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className='backdrop-blur-md bg-black/30' 
    >
      <ModalContent className='bg-white drop-shadow-lg rounded-lg p-6'>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1 bg-white text-center'>
              <h2 className='text-lg font-semibold text-gray-800'>{title}</h2>
            </ModalHeader>
            <ModalBody>
              <p className='text-gray-600 text-sm'>{message}</p>
            </ModalBody>
            <ModalFooter className='flex justify-end gap-2'>
              <Button
                color='danger'
                variant='light'
                className='text-gray-700 border-gray-300'
                onPress={onClose}>
                Close
              </Button>
              <Button
                color='primary'
                className='bg-blue-500 text-white hover:bg-blue-600'
                onPress={() => {
                  onConfirm();
                  onClose();
                }}>
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ConfirmationModal;
