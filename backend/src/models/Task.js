const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

// I had to set _id to String because mongoose uses ObjectId by default
// but the assignment wants UUID v4 strings as IDs
const taskSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  due_date: {
    type: Date,
    default: null
  },
  // low, medium, or high
  priority: {
    type: String,
    default: 'medium'
  },
  // pending or completed
  status: {
    type: String,
    default: 'pending'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, { _id: false })

// this renames _id to id before sending the response
// so the frontend gets { id: "..." } instead of { _id: "..." }
taskSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    return ret
  }
})

module.exports = mongoose.model('Task', taskSchema)
