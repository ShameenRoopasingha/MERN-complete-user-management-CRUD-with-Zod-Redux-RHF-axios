// 🧩 Modal Components Split Out
import React, { useState } from "react";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../features/users/userApiSlice";
import { Modal, useModal } from "../modal/animated-modal";
import DeleteUserModal from "./DeleteUserModal";
import UpdateUserModal from "./UpdateUserModal";

const UserList = () => {
  const { setOpen } = useModal();
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const isAdmin = localStorage.getItem("role") === "admin-seller";

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users</p>;

  return (
    <table className="table-auto border-collapse w-full p-20">
      <thead>
        <tr>
          <th className="border px-4 py-2">Name</th>
          <th className="border px-4 py-2">Role</th>
          <th className="border px-4 py-2">Email</th>
          <th className="border px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {users?.map((user: any) => (
          <tr key={user._id}>
            <td className="border px-4 py-2">{user.username}</td>
            <td className="border px-4 py-2">{user.role}</td>
            <td className="border px-4 py-2">{user.email}</td>
            <td className="border px-4 py-2 flex gap-2 justify-center">
              {isAdmin && (
                <DeleteUserModal userId={user._id} deleteUser={deleteUser} />
              )}

              <UpdateUserModal
                user={user}
                isAdmin={isAdmin}
                updateUser={updateUser}
                setCurrentUser={setCurrentUser}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserList;
