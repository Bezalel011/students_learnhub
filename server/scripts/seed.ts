import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../src/models/Course.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/learnhub";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    await Course.deleteMany({});
    await Course.insertMany([
      {
        title: "AI Fundamentals",
        description: "Learn the core concepts of Artificial Intelligence and its applications.",
        price: 499,
        thumbnailUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&q=80"
      },
      {
        title: "Web Development Basics",
        description: "HTML, CSS, and JavaScript for beginners to build modern web pages.",
        price: 299,
        thumbnailUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80"
      },
      {
        title: "Data Science Essentials",
        description: "Understand Python, data visualization, and analytics foundations.",
        price: 599,
        thumbnailUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=400&q=80"
      }
    ]);
    console.log("✅ Courses seeded successfully with Unsplash images!");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
