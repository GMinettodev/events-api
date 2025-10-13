import React from 'react';

// Function to format the event date
const formatDate = (date) => {
  if (!date) return '-'; // Handle empty or invalid dates
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const eventDate = new Date(date);
  if (isNaN(eventDate)) return 'Invalid Date'; // Handle invalid date
  return eventDate.toLocaleDateString('en-US', options);
};

export default function EventList({ events, onCreate, loading }) {
  return (
    <>
      <div className="flex-container">
        <h2>Events</h2>
        <button
          onClick={onCreate}
          className="btn btn-success"
          aria-label="Create new event"
          type="button"
          disabled={loading}
        >
          Create event
        </button>
      </div>

      <table className="table-container">
        <thead>
          <tr>
            <th className="table-header">Title</th>
            <th className="table-header">Date</th>
            <th className="table-header">Location</th>
            <th className="table-header">Description</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 && (
            <tr>
              <td colSpan="4" className="no-events-message">
                No events found.
              </td>
            </tr>
          )}
          {events.map((event) => (
            <tr key={event.id}>
              <td className="table-cell">{event.title}</td>
              <td className="table-cell">{formatDate(event.date)}</td>{' '}
              {/* Format the date */}
              <td className="table-cell">{event.location || '-'}</td>
              <td className="table-cell">{event.description || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
