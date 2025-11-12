import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Dashboard(){
  const [enrolled, setEnrolled] = useState<any[]>([]);
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(!token) return;
    // naive approach: fetch all courses and filter by user's enrolledCourses in backend would be better
    api.get('/courses').then(r=> setEnrolled(r.data)).catch(e=>console.error(e));
  }, []);
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p className="text-sm opacity-80 mb-4">Your enrolled courses (placeholder list):</p>
      <ul className="space-y-3">
        {enrolled.map(c=> (<li key={c._id} className="border p-3 rounded">{c.title}</li>))}
      </ul>
    </div>
  );
}
