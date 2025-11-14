import { useEffect, useState } from "react";
import api from "../lib/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [courses, setCourses] = useState<any[]>([]);
  const token = localStorage.getItem("token");

  // Load enrolled courses & their progress
  useEffect(() => {
    if (!token) return;

    api
      .get("/courses/enrolled/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (res) => {
        const enrolledCourses = res.data;

        // Fetch progress for each course
        const withProgress = await Promise.all(
          enrolledCourses.map(async (course: any) => {
            const progressRes = await api.get(`/courses/${course._id}/progress`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            return {
              ...course,
              progress: progressRes.data.percent,
            };
          })
        );

        setCourses(withProgress);
      })
      .catch(() => setCourses([]));
  }, [token]);

  // Not logged in
  if (!token)
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold text-gray-700">Please Log In</h2>
        <p className="text-gray-500 mt-2">
          Login to view your enrolled courses and progress.
        </p>
      </div>
    );

  // No enrolled courses
  if (courses.length === 0)
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-gray-700">
          No Courses Enrolled Yet
        </h2>
        <p className="text-gray-500 mt-2">
          Start learning by browsing our course catalog!
        </p>
        <Link
          to="/courses"
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Browse Courses
        </Link>
      </div>
    );

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Learning</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c: any) => (
          <div
            key={c._id}
            className="border rounded-xl shadow-sm hover:shadow-lg transition bg-white"
          >
            {c.thumbnailUrl && (
              <img
                src={c.thumbnailUrl}
                alt={c.title}
                className="w-full h-40 object-cover rounded-t-xl"
              />
            )}

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{c.title}</h3>

              {/* ⭐ REAL Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${c.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {c.progress}% completed
                </p>
              </div>

              <Link
                to={`/courses/${c._id}`}
                className="block mt-4 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Continue Learning →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
