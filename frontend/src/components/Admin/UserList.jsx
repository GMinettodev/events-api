import React from 'react';

export default function UserList({
  users,
  onEdit,
  onDelete,
  onCreate,
  loading,
}) {
  return (
    <>
      <div className="flex-container">
        <h2>Manage Users</h2>
        <button
          onClick={onCreate}
          className="btn btn-success"
          aria-label="Create new user"
          type="button"
          disabled={loading}
        >
          Add User
        </button>
      </div>

      <table className="table-container">
        <thead>
          <tr>
            <th className="table-header">Name</th>
            <th className="table-header">Email</th>
            <th className="table-header">Role</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan="4" className="no-users-message">
                No users found.
              </td>
            </tr>
          )}
          {users.map((user) => (
            <tr key={user.id}>
              <td className="table-cell">{user.name}</td>
              <td className="table-cell">{user.email}</td>
              <td className="table-cell">{user.role}</td>
              <td className="table-cell table-actions">
                <button
                  className="btn btn-edit"
                  onClick={() => onEdit(user)}
                  disabled={loading}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => onDelete(user.id)}
                  disabled={loading}
                  type="button"
                >
                  Delete
                </button>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
