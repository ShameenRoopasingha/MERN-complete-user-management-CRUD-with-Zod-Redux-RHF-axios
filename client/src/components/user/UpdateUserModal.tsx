import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "../modal/animated-modal";
import { Input } from "../input/input";

interface Props {
  user: any;
  isAdmin: boolean;
  updateUser: any;
  setCurrentUser: (user: any) => void;
}

const UpdateUserModal: React.FC<Props> = ({
  user,
  isAdmin,
  updateUser,
  setCurrentUser,
}) => {
  const [editUserName, setEditUserName] = useState(user.username);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editRole, setEditRole] = useState(user.role);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert("Please fill all password fields.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("New password do not match!");
      return;
    }
    try {
      await updateUser({
        id: user._id,
        username: editUserName,
        email: editEmail,
        role: editRole,
        currentPassword,
        newPassword,
        confirmNewPassword,
      }).unwrap();
      alert("User updated successfully!");
    } catch (error: any) {
      console.error(error);
      const message =
        error?.data?.message ?? "Update failed due to network/server error";
      alert("Update failed: " + message);
    }
  };

  return (
    <Modal>
      <button type="button" onClick={() => setCurrentUser(user)}>
        <ModalTrigger className="bg-yellow-500 text-black font-bold px-2 py-1 rounded text-[20px]">
          Update
        </ModalTrigger>
      </button>

      <ModalBody>
        <ModalContent>
          <h2 className="text-2xl font-bold mb-10">Update your user details</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-2">
              <label
                className="text-sm basis-1/4 flex items-center"
                htmlFor="username"
              >
                Username
              </label>
              <Input
                className="text-sm basis-3/4"
                value={editUserName}
                onChange={(e) => setEditUserName(e.target.value)}
                type="text"
                placeholder="Enter your username"
                id="username"
              />
            </div>

            {isAdmin && (
              <div className="flex flex-row gap-2">
                <label
                  className="text-sm basis-1/4 flex items-center"
                  htmlFor="role"
                >
                  Role
                </label>
                <select
                  className="text-sm basis-3/4 text-white bg-transparent border rounded-md h-9"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  id="role"
                >
                  <option
                    disabled
                    selected
                    className="bg-black text-white"
                    value="admin-seller"
                  >
                    - Select Role -
                  </option>
                  <option className="bg-black text-white" value="admin-seller">
                    Admin Seller
                  </option>
                  <option className="bg-black text-white" value="seller">
                    Seller
                  </option>
                  <option className="bg-black text-white" value="supplier">
                    Supplier
                  </option>
                  <option className="bg-black text-white" value="customer">
                    Customer
                  </option>
                </select>
              </div>
            )}

            <div className="flex flex-row gap-2">
              <label
                className="text-sm basis-1/4 flex items-center"
                htmlFor="email"
              >
                Email
              </label>
              <Input
                className="text-sm basis-3/4"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                type="email"
                id="email"
              />
            </div>

            <div className="flex flex-row gap-2">
              <label
                className="text-sm basis-1/4 flex items-center"
                htmlFor="current-password"
              >
                Current Password
              </label>
              <Input
                className="text-sm basis-3/4"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                type="password"
                id="current-password"
              />
            </div>

            <div className="flex flex-row gap-2">
              <label
                className="text-sm basis-1/4 flex items-center"
                htmlFor="new-password"
              >
                New Password
              </label>
              <Input
                className="text-sm basis-3/4"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                id="new-password"
              />
            </div>

            <div className="flex flex-row gap-2">
              <label
                className="text-sm basis-1/4 flex items-center"
                htmlFor="confirm-password"
              >
                Confirm New Password
              </label>
              <Input
                className="text-sm basis-3/4"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                type="password"
                id="confirm-password"
              />
            </div>
          </div>
        </ModalContent>

        <ModalFooter className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="bg-[#96DD99] font-bold text-[#16161d] w-[100px] h-[50px] rounded-[50px] text-[20px] flex justify-center items-center"
          >
            Save
          </button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
};

export default UpdateUserModal;
