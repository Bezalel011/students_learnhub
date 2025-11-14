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
        thumbnailUrl:
          "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&q=80",

        lessons: [
          { title: "Introduction to AI", content: "What is AI? Applications and history." },
          { title: "Machine Learning Basics", content: "Supervised, unsupervised, reinforcement learning." },
          { title: "Neural Networks", content: "How neural networks work and where they are used." },
          { title: "Deep Learning", content: "Understanding CNNs, RNNs, and transformers." },
          { title: "AI in Real Life", content: "Practical use-cases of AI in industries." }
        ]
      },

      {
        title: "Web Development Basics",
        description: "HTML, CSS, and JavaScript for beginners to build modern web pages.",
        price: 299,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80",

        lessons: [
          { title: "HTML Basics", content: "Elements, tags, attributes, structure." },
          { title: "CSS Styling", content: "Selectors, layouts, responsive styling." },
          { title: "JavaScript Intro", content: "Variables, functions, DOM manipulation." },
          { title: "Forms & Validation", content: "Creating and validating HTML forms." },
          { title: "Building Your First Webpage", content: "Combine HTML, CSS, and JS." }
        ]
      },

      {
        title: "Data Science Essentials",
        description: "Understand Python, data visualization, and analytics foundations.",
        price: 599,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=400&q=80",

        lessons: [
          { title: "Introduction to Data Science", content: "Definition, lifecycle, tools used." },
          { title: "Python for Data Science", content: "NumPy, Pandas, Jupyter basics." },
          { title: "Data Cleaning", content: "Handling missing values, duplicates, transformations." },
          { title: "Data Visualization", content: "Matplotlib, Seaborn basics and concepts." },
          { title: "Intro to Machine Learning", content: "Regression, classification, clustering." }
        ]
      }
    ]);

    console.log("✅ Courses with lessons seeded successfully!");

  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
