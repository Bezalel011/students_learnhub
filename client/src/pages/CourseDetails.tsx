import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    api.get(`/courses/${id}`).then((res) => setCourse(res.data));
  }, [id]);

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
      .catch(() => {});
  }, [id, token]);

  const loadProgress = () => {
    api
      .get(`/courses/${id}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCompletedLessons(res.data.completedLessonIds || []);
      });
  };

  const enroll = () => {
    if (!token) {
      alert("Please login to enroll in this course.");
      return;
    }

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
      });
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Course Image */}
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

        {!isEnrolled && (
          <button
            onClick={enroll}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Enroll Now
          </button>
        )}

        {isEnrolled && (
          <button
            disabled
            className="mt-4 px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
          >
            Already Enrolled ✔️
          </button>
        )}
      </div>

      {isEnrolled && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-3">Course Lessons</h2>

          {course.lessons.map((lesson: any) => {
            const done = completedLessons.includes(lesson._id);

            return (
              <div key={lesson._id} className="border p-4 rounded-lg mb-3">
                <h3 className="font-semibold text-lg">{lesson.title}</h3>
                <p className="text-sm mt-1">{lesson.content}</p>

                {!done && (
                  <button
                    onClick={() =>
                      api.post(
                        `/courses/${id}/lessons/${lesson._id}/complete`,
                        {},
                        { headers: { Authorization: `Bearer ${token}` } }
                      ).then(() =>
                        setCompletedLessons((prev) => [...prev, lesson._id])
                      )
                    }
                    className="mt-3 px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Mark Completed
                  </button>
                )}

                {done && (
                  <button
                    disabled
                    className="mt-3 px-3 py-1 bg-gray-400 text-white rounded"
                  >
                    Completed ✔️
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!isEnrolled && (
        <p className="mt-8 text-gray-500 text-sm">
          Enroll to access lessons and track your learning progress.
        </p>
      )}
    </div>
  );
}
