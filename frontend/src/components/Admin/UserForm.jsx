import React from 'react';

export default function UserForm({
  formTitle,
  userData,
  onChange,
  onSubmit,
  onCancel,
  loading,
  submitLabel,
  showPasswordRequired = false,
}) {
  return (
    <section className="card form-container">
      <h2>{formTitle}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            className="form-input"
            value={userData.name}
            onChange={(e) => onChange({ ...userData, name: e.target.value })}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-input"
            value={userData.email}
            onChange={(e) => onChange({ ...userData, email: e.target.value })}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label>Role:</label>
          <select
            className="form-input"
            value={userData.role}
            onChange={(e) => onChange({ ...userData, role: e.target.value })}
            disabled={loading}
            required
          >
            <option value="volunteer">Volunteer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            placeholder={
              submitLabel === 'Save'
                ? 'Leave blank to keep current password'
                : ''
            }
            className="form-input"
            value={userData.password}
            onChange={(e) =>
              onChange({ ...userData, password: e.target.value })
            }
            disabled={loading}
            required={showPasswordRequired && !userData.password}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn" disabled={loading}>
            {submitLabel}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
