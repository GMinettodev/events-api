import React from 'react';

const formatDate = (date) => {
  if (!date) return '-';
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const d = new Date(date);
  if (isNaN(d)) return 'Invalid Date';
  return d.toLocaleDateString('en-US', options);
};

export default function EventList({
  events,
  onEdit,
  onDelete,
  onCreate,
  loading,
}) {
  return (
    <>
      <div className="flex-container">
        <h2>Manage Events</h2>
        <button
          onClick={onCreate}
          className="btn btn-success"
          aria-label="Create new event"
          type="button"
          disabled={loading}
        >
          Add Event
        </button>
      </div>

      <table className="table-container">
        <thead>
          <tr>
            <th className="table-header">Title</th>
            <th className="table-header">Date</th>
            <th className="table-header">Location</th>
            <th className="table-header">Description</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 && (
            <tr>
              <td colSpan="5" className="no-events-message">
                No events found.
              </td>
            </tr>
          )}
          {events.map((event) => (
            <tr key={event.id}>
              <td className="table-cell">{event.title}</td>
              <td className="table-cell">{formatDate(event.date)}</td>
              <td className="table-cell">{event.location || '-'}</td>
              <td className="table-cell">{event.description || '-'}</td>
              <td className="table-cell table-actions">
                <button
                  className="btn btn-edit"
                  onClick={() => onEdit(event)}
                  disabled={loading}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => onDelete(event.id)}
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
