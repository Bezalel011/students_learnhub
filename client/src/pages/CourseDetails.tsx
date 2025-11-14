import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const token = localStorage.getItem("token");

  // Load course details
  useEffect(() => {
    api.get(`/courses/${id}`).then((res) => setCourse(res.data));
  }, [id]);

  // Check if user is enrolled + fetch completed lessons
  useEffect(() => {
    if (!token) return;

    api
      .get("/courses/enrolled/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const enrolled = res.data.some((c: any) => c._id === id);
        setIsEnrolled(enrolled);

        if (enrolled) loadProgress();
      })
      .catch((err) => console.error("Check enroll error:", err));
  }, [id, token]);

  // Load course progress details
  const loadProgress = () => {
    if (!token) return;

    api
      .get(`/courses/${id}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Convert completed lesson IDs to string list
        setCompletedLessons(res.data.completedLessonIds || []);
      })
      .catch((err) => console.error("Progress error:", err));
  };

  // Handle enroll
  const enroll = () => {
    api
      .post(
        `/courses/${id}/enroll`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setIsEnrolled(true);
        loadProgress();
      })
      .catch((err) => console.error("Enroll error:", err));
  };

  // Mark lesson as completed
  const markComplete = (lessonId: string) => {
    if (!token) return;

    api
      .post(
        `/courses/${id}/lessons/${lessonId}/complete`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setCompletedLessons((prev) => [...prev, lessonId]);
      })
      .catch((err) => console.error("Complete error:", err));
  };

  if (!course) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      {course.thumbnailUrl && (
        <img
          src={course.thumbnailUrl}
          className="w-full h-60 object-cover rounded-lg"
        />
      )}

      <h1 className="text-3xl font-bold mt-4">{course.title}</h1>
      <p className="mt-3 text-gray-700">{course.description}</p>

      <div className="mt-6">
        <span className="text-xl font-semibold text-blue-600">
          ₹{course.price}
        </span>

        {!token && (
          <p className="text-red-500 mt-4">Please log in to enroll.</p>
        )}

        {token && !isEnrolled && (
          <button
            onClick={enroll}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Enroll Now
          </button>
        )}

        {token && isEnrolled && (
          <button
            disabled
            className="mt-4 px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
          >
            Already Enrolled ✔️
          </button>
        )}
      </div>

      {/* ⭐ Lessons only visible after enrolling */}
      {isEnrolled && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-3">Course Lessons</h2>

          {course.lessons && course.lessons.length > 0 ? (
            course.lessons.map((lesson: any) => {
              const done = completedLessons.includes(lesson._id);

              return (
                <div
                  key={lesson._id}
                  className="border p-4 rounded-lg mb-3 shadow-sm bg-white"
                >
                  <h3 className="font-semibold text-lg">{lesson.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{lesson.content}</p>

                  {!done ? (
                    <button
                      onClick={() => markComplete(lesson._id)}
                      className="mt-3 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Mark Completed
                    </button>
                  ) : (
                    <button
                      disabled
                      className="mt-3 px-3 py-1 bg-gray-400 text-white rounded cursor-not-allowed"
                    >
                      Completed ✔️
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <p>No lessons available.</p>
          )}
        </div>
      )}
    </div>
  );
}
