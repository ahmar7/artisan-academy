const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  profile: String,
  
});

const ProfileModel = mongoose.model('profile', profileSchema);

module.exports = ProfileModel;
