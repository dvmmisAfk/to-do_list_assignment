const taskService = require('../services/taskService')

async function getAllTasks(req, res, next) {
  try {
    const { search, status, priority } = req.query
    const tasks = await taskService.getAllTasks(search, status, priority)
    res.json({ tasks, total: tasks.length })
  } catch (err) {
    next(err)
  }
}

async function getTaskById(req, res, next) {
  try {
    const task = await taskService.getTaskById(req.params.id)
    res.json(task)
  } catch (err) {
    next(err)
  }
}

async function createTask(req, res, next) {
  try {
    const task = await taskService.createTask(req.body)
    res.status(201).json(task)
  } catch (err) {
    next(err)
  }
}

async function updateTask(req, res, next) {
  try {
    const task = await taskService.updateTask(req.params.id, req.body)
    res.json(task)
  } catch (err) {
    next(err)
  }
}

async function patchTask(req, res, next) {
  try {
    const task = await taskService.patchTask(req.params.id, req.body)
    res.json(task)
  } catch (err) {
    next(err)
  }
}

async function deleteTask(req, res, next) {
  try {
    await taskService.deleteTask(req.params.id)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

module.exports = { getAllTasks, getTaskById, createTask, updateTask, patchTask, deleteTask }
