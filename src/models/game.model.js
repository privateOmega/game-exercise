const mongoose = require('mongoose');

const userModel = require('./user.model');

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

gameSchema.post('save', async function(gameInstance, next) {
  const userInstance = await userModel.findById(gameInstance.user);
  userInstance.games.push(gameInstance.id);
  await userInstance.save();
  next();
});

gameSchema.post('findOneAndUpdate', async function(
  gameInstance,
  next,
) {
  const userInstance = await userModel.findById(gameInstance.user);
  userInstance.highScore = Math.max(
    userInstance.highScore,
    gameInstance.score,
  );
  await userInstance.save();
  next();
});

const gameModel = mongoose.model('game', gameSchema);

module.exports = gameModel;
