const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Story = mongoose.model('Story', storySchema);
module.exports = Story;
