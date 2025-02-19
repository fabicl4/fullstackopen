const mongoose = require('mongoose')

/**
 * 4.15.
 * Create the User schema
 *
 * 4.16
 * oth username and password must be given and both must be at least 3
 * characters long. The username must be unique.
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    //required: true,
  },
  passwordHash: { // The password must be at least 3 characters long not the hash
    type: String,
    required: true,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User