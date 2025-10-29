// src/App.jsx
import { useState } from "react";
import BookModal from "./BookModal";

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dark, setDark] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const searchBooks = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setBooks([]);
    setShowAlert(false);

    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=20`
      );
      if (!res.ok) throw new Error("Network error");

      const data = await res.json();

      if (!data.docs || data.docs.length === 0) {
        setShowAlert(true);
      } else {
        setBooks(data.docs);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setBooks([]);
    setShowAlert(false);
  };

  return (
    <div
      className={`min-h-screen ${
        dark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-black"
          : "bg-gradient-to-br from-blue-50 via-white to-blue-100 text-black-800"
      } p-4 sm:p-6 transition-all duration-700`}
    >
      {/* HEADER */}
      <header className="text-center mb-8 relative">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
          📚 Booksy-Book Finder
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
          Search it. Learn.it Evolve.it
        </p>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="absolute right-2 sm:right-4 top-0 px-3 sm:px-4 py-2 rounded-lg bg-blue-600 text-white dark:bg-yellow-400 dark:text-black hover:scale-105 transition-transform text-sm sm:text-base"
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      {/* SEARCH BAR */}
      <form
        onSubmit={searchBooks}
        className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-0 mb-8 max-w-xl mx-auto"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter book title..."
          className="w-full sm:w-[70%] p-3 rounded-lg sm:rounded-l-lg border border-blue-500 outline-none dark:bg-gray-700 dark:text-white text-sm sm:text-base"
        />

        <div className="flex gap-2 sm:gap-0 w-full sm:w-auto justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 sm:px-6 py-2 rounded-lg sm:rounded-none sm:rounded-r-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            Search
          </button>

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all w-full sm:w-auto"
              title="Clear search"
            >
              ❌
            </button>
          )}
        </div>
      </form>

      {/* Loading + Errors */}
      {loading && (
        <p className="text-center text-purple-600 dark:text-purple-300 animate-pulse">
          Loading...
        </p>
      )}
      {error && <p className="text-center text-red-600">{error}</p>}

      {/* BOOK GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {books.map((book, index) => (
          <div
            key={book.key || index}
            onClick={() => setSelectedBook(book)}
            className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md hover:shadow-2xl hover:scale-105 transform transition-all duration-300 cursor-pointer"
          >
            {book.cover_i ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
                className="w-full h-48 sm:h-64 object-cover rounded"
              />
            ) : (
              <div className="w-full h-48 sm:h-64 bg-gray-300 dark:bg-gray-700 flex items-center justify-center rounded text-gray-500 text-xs sm:text-sm">
                No Cover
              </div>
            )}
            <h3 className="text-sm sm:text-lg font-semibold mt-3 dark:text-white truncate">
              {book.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">
              {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
            </p>
            <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
              {book.first_publish_year || "N/A"}
            </p>
          </div>
        ))}
      </div>

      {!loading && !error && books.length === 0 && !showAlert && (
        <p className="text-center text-gray-500 mt-8 dark:text-gray-400 text-sm sm:text-base">
          Try searching for a book above.
        </p>
      )}

      {/* ALERT POPUP */}
      {showAlert && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
          onClick={() => setShowAlert(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 text-center p-6 rounded-2xl max-w-xs sm:max-w-sm w-11/12 shadow-2xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400 mb-2">
              Book Not Found!
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm sm:text-base">
              Please check the spelling or try a different title.
            </p>
            <button
              onClick={() => setShowAlert(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all text-sm sm:text-base"
            >
              Okay
            </button>
          </div>
        </div>
      )}

      {/* Book details modal */}
      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  );
}
