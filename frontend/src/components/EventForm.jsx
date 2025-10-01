import { useState } from 'react';
import FormInput from './FormInput';
import FormTextarea from './FormTextarea'; // Optional: use if you want to replace description input with a textarea

export default function EventForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    max_volunteers: 50,
  });
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      await onSubmit(form);
    } catch {
      setError('Error creating event');
    }
  }

  return (
    <form
      className="form card"
      onSubmit={handleSubmit}
      style={{ width: '100%', marginTop: '2rem' }}
    >
      <h2 style={{ marginBottom: '1rem' }}>Create New Event</h2>

      {error && <p className="alert">{error}</p>}

      <FormInput
        label="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        required
      />

      {/* Replace this with FormTextarea if preferred */}
      <FormInput
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        required
      />

      <div className="form-row">
        <FormInput
          label="Date"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Max Volunteers"
          type="number"
          name="max_volunteers"
          value={form.max_volunteers}
          onChange={handleChange}
        />
      </div>

      <FormInput
        label="Location"
        name="location"
        value={form.location}
        onChange={handleChange}
        required
      />

      <div style={{ marginTop: '1.5rem' }}>
        <button type="submit" className="btn">
          Save Event
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          style={{ marginLeft: '1rem' }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
