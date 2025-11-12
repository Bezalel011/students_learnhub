import { useEffect, useState } from "react";
import api from "../lib/api";
import { Link } from "react-router-dom";

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);
  useEffect(() => {
  api.get('/courses').then(r => {
    console.log("Courses from backend:", r.data); 
    setCourses(r.data);
  });
}, []);
  return (
    <div className="p-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(c=> (
        <div key={c._id} className="border rounded-xl p-4 shadow-md">
          {c.thumbnailUrl && <img src={c.thumbnailUrl} className="w-full h-40 object-cover rounded-lg" alt={c.title} />}
          <h3 className="text-lg font-bold mt-2">{c.title}</h3>
          <p className="text-sm opacity-80">{c.description}</p>
          <div className="flex justify-between mt-3">
            <span className="font-semibold">₹{c.price}</span>
            <Link to={`/courses/${c._id}`} className="text-blue-500 underline">View</Link>
          </div>
        </div>
      ))}
    </div>
  );
}
