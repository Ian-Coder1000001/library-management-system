import { useState, useEffect } from "react";
import { API_URL } from "../api.js";
import BookCard from "./BookCard.jsx";
import BookCardSkeleton from "./BookCardSkeleton.jsx";

const PAGE_SIZE = 12;

function BookGrid({ genreId, search, sort, page, onPageChange }) {
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("loading"); // loading, error or success
  const [attempt, setAttempt] = useState(0); // bump this to try the request again

  useEffect(() => {
    let ignore = false;
    setStatus("loading");

    const params = new URLSearchParams({ page, limit: PAGE_SIZE, sort });
    if (genreId) params.set("genreId", genreId);
    if (search) params.set("search", search);

    fetch(`${API_URL}/books?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        return res.json();
      })
      .then((json) => {
        // ignore answers from old requests (the filters may have changed already)
        if (ignore) return;
        setBooks(json.data);
        setTotal(json.total);
        setTotalPages(json.totalPages);
        setStatus("success");
      })
      .catch(() => {
        if (!ignore) setStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, [genreId, search, sort, page, attempt]);

  if (status === "loading") {
    return (
      <div className="book-grid" role="status" aria-label="Loading books">
        {Array.from({ length: 6 }, (_, index) => (
          <BookCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="state-box" role="alert">
        <h2>Could not load the books</h2>
        <p>Check that the server is running, then try again.</p>
        <button onClick={() => setAttempt(attempt + 1)}>Try again</button>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="state-box">
        <h2>No books found</h2>
        <p>Try a different search or choose another genre.</p>
      </div>
    );
  }

  return (
    <>
      <p className="result-count">
        {total} {total === 1 ? "book" : "books"} found
      </p>

      <div className="book-grid">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default BookGrid;