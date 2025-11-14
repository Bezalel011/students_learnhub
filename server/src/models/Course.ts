import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnailUrl: String,

  lessons: [lessonSchema],   // <── ADD THIS
});

export default mongoose.model("Course", courseSchema);
