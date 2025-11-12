import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, default: 0 },
  thumbnailUrl: String
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
