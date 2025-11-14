import { Link } from "react-router-dom";

type Props = {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnailUrl?: string;
};

export default function CourseCard({
  _id,
  title,
  description,
  price,
  thumbnailUrl,
}: Props) {
  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white">
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-40 object-cover rounded-lg"
        />
      )}

      <h3 className="text-lg font-semibold mt-2">{title}</h3>

      <p className="text-sm opacity-80 line-clamp-3">{description}</p>

      <div className="mt-3 flex items-center justify-between">
        <span className="font-bold text-blue-600">₹{price}</span>

        <Link
          to={`/courses/${_id}`}
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          View
        </Link>
      </div>
    </div>
  );
}
