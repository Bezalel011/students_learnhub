import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";

export default function CourseDetails(){
  const { id } = useParams(); const [course, setCourse] = useState<any>(null);
  useEffect(()=>{ api.get(`/courses/${id}`).then(r=>setCourse(r.data)).catch(e=>console.error(e)); }, [id]);
  const enroll = async () => {
    const token = localStorage.getItem('token');
    try {
      await api.post(`/courses/${id}/enroll`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert('Enrolled successfully!');
    } catch (err:any) { console.error(err.response?.data||err.message); alert('Enroll failed'); }
  };
  if(!course) return <div className="p-6">Loading...</div>;
  return (
    <div className="max-w-3xl mx-auto p-6">
      {course.thumbnailUrl && <img src={course.thumbnailUrl} alt={course.title} className="rounded-lg w-full h-60 object-cover" />}
      <h1 className="text-2xl font-bold mt-4">{course.title}</h1>
      <p className="text-gray-700 mt-2">{course.description}</p>
      <p className="text-xl font-semibold mt-3">₹{course.price}</p>
      <button onClick={enroll} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600">Enroll Now</button>
    </div>
  );
}
