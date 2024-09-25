const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

//DO NOT SAVE YOUR PASSWORD TO GITHUB!!!
const url = process.env.MONGODB_URI


mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
  })
  
  noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Note', noteSchema)
