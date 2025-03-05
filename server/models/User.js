const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  profilePhoto: { type: String },
  bio: { type: String, default: '' },
  links: [{
    title: String,
    url: String,
    enabled: { type: Boolean, default: false },
  }],
  shops: [{
    title: String,
    url: String,
    enabled: { type: Boolean, default: false },
  }],
  bannerColor: { type: String, default: '#000000' },
  appearanceSettings: {
    layout: { type: String, default: 'Stack' },
    buttonStyle: { type: String, default: 'Fill' },
    font: { type: String, default: 'DM Sans' },
    theme: { type: String, default: 'Air Snow' },
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);