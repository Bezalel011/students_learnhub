import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Course from "../models/Course.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * @route   GET /api/courses
 * @desc    Fetch all available courses
 * @access  Public
 */
router.get("/", async (_req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error("❌ Error fetching courses:", err);
    res.status(500).json({ message: "Server error fetching courses" });
  }
});

/**
 * @route   GET /api/courses/:id
 * @desc    Fetch details of a specific course
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    console.error("❌ Error fetching course:", err);
    res.status(400).json({ message: "Invalid course ID" });
  }
});

/**
 * @route   POST /api/courses/:id/enroll
 * @desc    Enroll a user in a course
 * @access  Protected (requires JWT)
 */
router.post("/:id/enroll", async (req, res) => {
  try {
    // 1️⃣ Verify the Authorization header and token
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Missing authorization header" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded !== "object" || !("id" in decoded))
      return res.status(400).json({ message: "Invalid token payload" });

    // 2️⃣ Find the user
    const user = await User.findById((decoded as any).id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // 3️⃣ Validate the course exists
    const courseId = req.params.id;
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    const course = await Course.findById(courseObjectId);
    if (!course)
      return res.status(404).json({ message: "Course not found" });

    // 4️⃣ Enroll the user if not already enrolled
    if (!user.enrolledCourses.some(id => id.equals(courseObjectId))) {
      user.enrolledCourses.push(courseObjectId);
      await user.save();
    }

    // 5️⃣ Respond
    res.json({
      message: "✅ Enrolled successfully",
      course: { id: course._id, title: course.title },
    });

  } catch (err: any) {
    console.error("❌ Enrollment error:", err.message);
    if (err.name === "JsonWebTokenError")
      return res.status(401).json({ message: "Invalid or expired token" });
    res.status(500).json({ message: "Server error during enrollment" });
  }
});

/**
 * @route   GET /api/courses/enrolled
 * @desc    Get all courses a user is enrolled in
 * @access  Protected (requires JWT)
 */
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

export default router;
