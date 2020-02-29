const mongoose = require('mongoose');

const { Schema } = mongoose;

const gameSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true, autoIndex: false },
);

gameSchema.index({ user: 1, createdAt: -1 });

const gameModel = mongoose.model('game', gameSchema);

module.exports = gameModel;
