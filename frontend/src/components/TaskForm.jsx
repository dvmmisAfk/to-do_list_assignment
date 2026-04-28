import { useState, useEffect } from 'react'

export default function TaskForm({ task, onSubmit, onClose, loading }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('medium')
  const [status, setStatus] = useState('pending')
  const [titleError, setTitleError] = useState('')

  // if we're editing, fill in the existing values
  useEffect(() => {
    if (task) {
      setTitle(task.title || '')
      setDescription(task.description || '')
      setDueDate(task.due_date ? task.due_date.split('T')[0] : '')
      setPriority(task.priority || 'medium')
      setStatus(task.status || 'pending')
    }
  }, [task])

  function handleSubmit(e) {
    e.preventDefault()

    if (!title.trim()) {
      setTitleError('title is required')
      return
    }

    setTitleError('')
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate || null,
      priority,
      status
    })
  }

  return (
    <div className="modal-bg">
      <div className="modal">
        <h2>{task ? 'Edit Task' : 'New Task'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => {
                setTitle(e.target.value)
                setTitleError('')
              }}
              placeholder="what needs to be done?"
              disabled={loading}
              autoFocus
            />
            {titleError && <span className="field-err">{titleError}</span>}
          </div>

          <div className="field">
            <label>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="add some details (optional)"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="field">
              <label>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} disabled={loading}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* only show status when editing */}
            {task && (
              <div className="field">
                <label>Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} disabled={loading}>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? 'Saving...' : task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
