const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const { TOKEN_SECRET } = process.env;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  highScore: {
    type: Number,
    default: 0,
  },
});

userSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

userSchema.methods.isValidPassword = async function(password) {
  const compare = await bcrypt.compare(password, this.password);
  return compare;
};

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, email: this.email, name: this.name },
    TOKEN_SECRET,
    { expiresIn: 60 * 60 },
  );
  return token;
};

userSchema.statics.findByCredentials = async function(
  email,
  password,
) {
  const userInstance = await userModel.findOne({ email });
  if (!userInstance) {
    throw new Error({ error: 'invalid login credentials' });
  }
  const validPassword = await userInstance.isValidPassword(password);
  if (!validPassword) {
    throw new Error({ error: 'invalid login credentials' });
  }
  return userInstance;
};

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
