const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    unique: true
  },
  name: String,
  blog: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }],
  passwordHash: String
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash      // passwordHash should never be revealed
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User