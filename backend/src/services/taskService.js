const Task = require('../models/Task')

function badDate(val) {
  return val && isNaN(new Date(val).getTime())
}

async function getAllTasks(search, status, priority) {
  let query = {}

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ]
  }

  if (status) query.status = status
  if (priority) query.priority = priority

  return Task.find(query).sort({ created_at: -1 })
}

async function getTaskById(id) {
  const task = await Task.findById(id)

  if (!task) {
    const err = new Error('task not found')
    err.status = 404
    throw err
  }

  return task
}

async function createTask(data) {
  if (!data.title || data.title.trim() === '') {
    const err = new Error('title is required')
    err.status = 400
    throw err
  }

  if (badDate(data.due_date)) {
    const err = new Error('due_date is not a valid date')
    err.status = 400
    throw err
  }

  const task = new Task({
    title: data.title.trim(),
    description: data.description || '',
    due_date: data.due_date || null,
    priority: data.priority || 'medium',
    status: 'pending'
  })

  await task.save()
  return task
}

// PUT - replaces the whole task, so title is still required
async function updateTask(id, data) {
  await getTaskById(id)

  if (!data.title || data.title.trim() === '') {
    const err = new Error('title is required')
    err.status = 400
    throw err
  }

  if (badDate(data.due_date)) {
    const err = new Error('due_date is not a valid date')
    err.status = 400
    throw err
  }

  const updated = await Task.findByIdAndUpdate(
    id,
    {
      title: data.title.trim(),
      description: data.description || '',
      due_date: data.due_date || null,
      priority: data.priority || 'medium',
      status: data.status || 'pending'
    },
    { new: true }
  )

  return updated
}

// PATCH - only update the fields that were sent
// used for toggling status between pending and completed
async function patchTask(id, data) {
  await getTaskById(id)

  const updated = await Task.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  )

  return updated
}

async function deleteTask(id) {
  await getTaskById(id)
  await Task.findByIdAndDelete(id)
}

module.exports = { getAllTasks, getTaskById, createTask, updateTask, patchTask, deleteTask }
