import React from 'react';

export default function EventForm({
  formTitle,
  eventData,
  onChange,
  onSubmit,
  onCancel,
  loading,
  submitLabel = 'Save',
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
          <label>Title:</label>
          <input
            type="text"
            className="form-input"
            name="title"
            value={eventData.title || ''}
            onChange={(e) => onChange({ ...eventData, title: e.target.value })}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            className="form-input"
            name="description"
            value={eventData.description || ''}
            onChange={(e) =>
              onChange({ ...eventData, description: e.target.value })
            }
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            className="form-input"
            name="date"
            value={eventData.date ? eventData.date.slice(0, 10) : ''}
            onChange={(e) => onChange({ ...eventData, date: e.target.value })}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            className="form-input"
            name="location"
            value={eventData.location || ''}
            onChange={(e) =>
              onChange({ ...eventData, location: e.target.value })
            }
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label>Max Volunteers:</label>
          <input
            type="number"
            className="form-input"
            name="max_volunteers"
            value={eventData.max_volunteers || ''}
            onChange={(e) =>
              onChange({
                ...eventData,
                max_volunteers: Number(e.target.value),
              })
            }
            disabled={loading}
            required
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
