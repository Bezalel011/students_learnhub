export default function About() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">About LearnHub</h1>
      <p className="text-gray-700 leading-relaxed mb-4">
        LearnHub is a student self-study platform designed to help learners
        access curated courses, notes, and track their learning progress. Our
        mission is to empower students with accessible education and tools for
        continuous growth.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">Our Vision</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        To create a connected learning ecosystem where students can explore,
        enroll, and upskill at their own pace — anywhere, anytime.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-2">What We Offer</h2>
      <ul className="list-disc pl-6 text-gray-700">
        <li>Interactive course modules and study notes</li>
        <li>Progress tracking and daily study streaks</li>
        <li>Affordable and high-quality content</li>
        <li>Personalized dashboards and recommendations</li>
      </ul>
    </div>
  );
}
