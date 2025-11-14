import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Course from "../models/Course.js";
import User from "../models/User.js";

const router = express.Router();

/* ----------------------------------------------------
   GET ENROLLED COURSES OF LOGGED-IN USER
---------------------------------------------------- */
router.get("/enrolled/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id).populate("enrolledCourses");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user.enrolledCourses || []);
  } catch (err: any) {
    console.error("❌ Error fetching enrolled courses:", err.message);
    res.status(500).json({ message: "Error fetching enrolled courses" });
  }
});

/* ----------------------------------------------------
   GET ALL COURSES
---------------------------------------------------- */
router.get("/", async (_req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error("❌ Error fetching courses:", err);
    res.status(500).json({ message: "Server error fetching courses" });
  }
});

/* ----------------------------------------------------
   GET COURSE BY ID
---------------------------------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course)
      return res.status(404).json({ message: "Course not found" });

    res.json(course);
  } catch (err) {
    console.error("❌ Error fetching course:", err);
    res.status(400).json({ message: "Invalid course ID" });
  }
});

/* ----------------------------------------------------
   ENROLL IN A COURSE
---------------------------------------------------- */
router.post("/:id/enroll", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Missing authorization header" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const courseId = req.params.id;
    const objectId = new mongoose.Types.ObjectId(courseId);

    const course = await Course.findById(objectId);
    if (!course)
      return res.status(404).json({ message: "Course not found" });

    if (!user.enrolledCourses.some(id => id.equals(objectId))) {
      user.enrolledCourses.push(objectId);
      await user.save();
    }

    res.json({
      message: "Enrolled successfully",
      course: { id: course._id, title: course.title },
    });

  } catch (err: any) {
    console.error("❌ Enroll error:", err.message);
    if (err.name === "JsonWebTokenError")
      return res.status(401).json({ message: "Invalid or expired token" });

    res.status(500).json({ message: "Error enrolling in course" });
  }
});

/* ====================================================
   ⭐ STEP 3 — MARK LESSON AS COMPLETED
==================================================== */
router.post("/:courseId/lessons/:lessonId/complete", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { courseId, lessonId } = req.params;

    // Avoid duplicate entries
    const already = user.completedLessons.some(
      (l: any) => l.courseId.equals(courseId) && l.lessonId.equals(lessonId)
    );

    if (!already) {
      user.completedLessons.push({ courseId, lessonId });
      await user.save();
    }

    res.json({ message: "Lesson marked as completed!" });
  } catch (err: any) {
    console.error("❌ Error completing lesson:", err.message);
    res.status(500).json({ message: "Error completing lesson" });
  }
});

/* ====================================================
   ⭐ STEP 3 — GET COURSE PROGRESS
==================================================== */
router.get("/:courseId/progress", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course)
      return res.status(404).json({ message: "Course not found" });

    const completed = user.completedLessons.filter(
      (l: any) => l.courseId.equals(courseId)
    );

    const totalLessons = course.lessons.length;
    const percent = totalLessons === 0
      ? 0
      : Math.round((completed.length / totalLessons) * 100);

    res.json({
      totalLessons,
      completedLessons: completed.length,
      percent,
    });
  } catch (err: any) {
    console.error("❌ Error fetching progress:", err.message);
    res.status(500).json({ message: "Error fetching progress" });
  }
});

export default router;
