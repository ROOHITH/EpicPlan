//document model
const mongoose = require("mongoose");
const documentSchema = new mongoose.Schema({
  content: String,
});

module.exports = mongoose.model("Document", documentSchema);
