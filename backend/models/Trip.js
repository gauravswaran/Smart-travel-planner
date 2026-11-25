const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true
  },
  travelDate: {
    type: Date,
    required: true
  },
  travelers: {
    type: Number,
    required: true
  },
  budget: {
  type: Number,
  required: true
},

user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}
}, {
  timestamps: true
});

module.exports = mongoose.model("Trip", tripSchema);