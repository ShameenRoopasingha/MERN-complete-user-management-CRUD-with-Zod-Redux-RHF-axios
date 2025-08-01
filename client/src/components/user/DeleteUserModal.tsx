import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "../modal/animated-modal";

interface Props {
  userId: string;
  deleteUser: (id: string) => void;
}

const DeleteUserModal: React.FC<Props> = ({ userId, deleteUser }) => {
  return (
    <Modal>
      <button type="button">
        <ModalTrigger className="bg-red-500 text-black font-bold px-2 py-1 rounded text-[20px]">
          Delete
        </ModalTrigger>
      </button>
      <ModalBody>
        <ModalContent className="flex flex-col items-center gap-[80px]">
          <big className="text-[25px]">Do you want to delete this record?</big>
          <div className="flex gap-4 text-[22px]">
            <button
              type="button"
              className="rounded-full bg-red-500 py-2 px-7"
              onClick={() => deleteUser(userId)}
            >
              Yes
            </button>
            <button
              type="button"
              className="rounded-full bg-green-500 py-2 px-7"
              onClick={() => document.body.click()} // closes modal
            >
              No
            </button>
          </div>
        </ModalContent>
      </ModalBody>
    </Modal>
  );
};

export default DeleteUserModal;
