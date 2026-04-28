import { useState, useEffect } from 'react'
import * as taskApi from './api/taskApi'
import TaskCard from './components/TaskCard'
import TaskForm from './components/TaskForm'
import SearchFilter from './components/SearchFilter'
import LoadingSpinner from './components/LoadingSpinner'
import './App.css'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [filters, setFilters] = useState({ search: '', status: '', priority: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // form state
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  // which task card button is currently doing something (for disabling buttons)
  const [busyTaskId, setBusyTaskId] = useState(null)

  // little success/error message at the bottom
  const [toast, setToast] = useState(null)

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // load tasks from the API
  async function fetchTasks() {
    setLoading(true)
    setError(null)
    try {
      const data = await taskApi.getAllTasks(filters)
      setTasks(data)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  // re-fetch whenever filters change
  useEffect(() => {
    fetchTasks()
  }, [filters])

  function openCreateForm() {
    setEditingTask(null)
    setShowForm(true)
  }

  function openEditForm(task) {
    setEditingTask(task)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingTask(null)
  }

  async function handleFormSubmit(data) {
    setFormLoading(true)
    try {
      if (editingTask) {
        await taskApi.updateTask(editingTask.id, data)
        showToast('task updated')
      } else {
        await taskApi.createTask(data)
        showToast('task created')
      }
      closeForm()
      fetchTasks() // reload the list
    } catch (err) {
      showToast(err.message, 'error')
    }
    setFormLoading(false)
  }

  async function handleToggleStatus(task) {
    setBusyTaskId(task.id)
    try {
      const newStatus = task.status === 'pending' ? 'completed' : 'pending'
      await taskApi.patchTask(task.id, { status: newStatus })
      fetchTasks()
    } catch (err) {
      showToast(err.message, 'error')
    }
    setBusyTaskId(null)
  }

  async function handleDelete(task) {
    if (!window.confirm(`Delete "${task.title}"?`)) return
    setBusyTaskId(task.id)
    try {
      await taskApi.deleteTask(task.id)
      showToast('task deleted')
      fetchTasks()
    } catch (err) {
      showToast(err.message, 'error')
    }
    setBusyTaskId(null)
  }

  const pendingCount = tasks.filter(t => t.status === 'pending').length
  const doneCount = tasks.filter(t => t.status === 'completed').length

  return (
    <div>
      <header className="header">
        <h1>My Tasks</h1>
        <div className="header-right">
          <span className="count-badge">{pendingCount} pending</span>
          <span className="count-badge done">{doneCount} done</span>
          <button className="btn primary" onClick={openCreateForm}>+ Add Task</button>
        </div>
      </header>

      <main className="main">
        <SearchFilter filters={filters} onChange={setFilters} />

        {error && (
          <div className="error-box">
            {error}
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {loading && <LoadingSpinner />}

        {!loading && tasks.length === 0 && (
          <div className="empty">
            <p>📋 No tasks here.</p>
            {(filters.search || filters.status || filters.priority)
              ? <p>Try clearing your filters.</p>
              : <button className="btn primary" onClick={openCreateForm}>Add your first task</button>
            }
          </div>
        )}

        {!loading && tasks.length > 0 && (
          <div className="task-list">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEditForm}
                onDelete={handleDelete}
                onToggle={handleToggleStatus}
                busy={busyTaskId === task.id}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleFormSubmit}
          onClose={closeForm}
          loading={formLoading}
        />
      )}

      {toast && (
        <div className={`toast ${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  )
}
