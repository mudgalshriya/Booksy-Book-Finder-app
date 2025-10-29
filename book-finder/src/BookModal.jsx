// src/BookModal.jsx
export default function BookModal({ book, onClose }) {
  if (!book) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl max-w-md w-11/12 shadow-2xl relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-red-500 text-xl"
        >
          ✖
        </button>

        {/* Book Cover */}
        {book.cover_i ? (
          <img
            src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
            alt={book.title}
            className="w-full h-72 object-cover rounded-md mb-4"
          />
        ) : (
          <div className="w-full h-72 bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-600">
            No Cover Available
          </div>
        )}

        {/* Book Info */}
        <h2 className="text-2xl font-bold mb-2 dark:text-white">{book.title}</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <strong>Author:</strong>{" "}
          {book.author_name ? book.author_name.join(", ") : "Unknown"}
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          <strong>First Published:</strong> {book.first_publish_year || "N/A"}
        </p>
        {book.subject && (
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            <strong>Subjects:</strong> {book.subject.slice(0, 5).join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
