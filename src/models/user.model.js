const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const { TOKEN_SECRET } = process.env;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    highScore: {
      type: Number,
      default: 0,
    },
    games: [
      {
        type: Schema.Types.ObjectId,
        ref: 'game',
      },
    ],
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true,
  },
);

userSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre('save', function() {
  // FIXME: Even though hashSync can stop event loop execution, asynchronous version has some problem since hashed password doesn't give true on comparison with same password
  const hash = bcrypt.hashSync(this.password, 10);
  this.password = hash;
});

userSchema.methods.isValidPassword = function(password) {
  const compare = bcrypt.compareSync(password, this.password);
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
