// formats a date like "Jan 5, 2025"
function formatDate(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

function isOverdue(due_date, status) {
  if (!due_date || status === 'completed') return false
  return new Date(due_date) < new Date()
}

export default function TaskCard({ task, onEdit, onDelete, onToggle, busy }) {
  const overdue = isOverdue(task.due_date, task.status)
  const done = task.status === 'completed'

  return (
    <div className={`task-card priority-${task.priority} ${done ? 'done' : ''}`}>
      <div className="card-top">
        {/* checkbox to toggle status */}
        <button
          className={`checkbox ${done ? 'checked' : ''}`}
          onClick={() => onToggle(task)}
          disabled={busy}
          title={done ? 'mark as pending' : 'mark as completed'}
        >
          {done ? '✓' : ''}
        </button>

        <div className="card-badges">
          <span className={`priority-tag ${task.priority}`}>{task.priority}</span>
          {task.due_date && (
            <span className={`due ${overdue ? 'overdue' : ''}`}>
              {overdue ? '⚠ overdue · ' : 'due · '}{formatDate(task.due_date)}
            </span>
          )}
        </div>
      </div>

      <div className="card-body">
        <h3 className={done ? 'strikethrough' : ''}>{task.title}</h3>
        {task.description && <p className="desc">{task.description}</p>}
      </div>

      <div className="card-bottom">
        <span className="created-at">added {formatDate(task.created_at)}</span>
        <div className="card-actions">
          <button className="btn small" onClick={() => onEdit(task)} disabled={busy}>
            Edit
          </button>
          <button className="btn small danger" onClick={() => onDelete(task)} disabled={busy}>
            {busy ? '...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
