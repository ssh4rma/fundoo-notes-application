import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  token: { type: String, default: null },
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
});

export default mongoose.model("User", userSchema);
