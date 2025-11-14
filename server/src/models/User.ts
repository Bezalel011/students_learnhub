import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],

  completedLessons: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      lessonId: { type: mongoose.Schema.Types.ObjectId },
    },
  ],
});

export default mongoose.model("User", userSchema);
