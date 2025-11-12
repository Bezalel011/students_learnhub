import { Link } from "react-router-dom";
export default function Home(){ return (
  <div className="p-10 max-w-4xl mx-auto">
    <h1 className="text-4xl font-bold mb-4">LearnHub</h1>
    <p className="mb-6">A student self-study platform — courses, notes, and progress tracking.</p>
    <div className="flex gap-3">
      <Link to="/courses" className="px-4 py-2 rounded bg-black text-white">Explore Courses</Link>
      <Link to="/signup" className="px-4 py-2 rounded border">Get Started</Link>
    </div>
  </div>
); }
