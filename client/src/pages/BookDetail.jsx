import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_URL } from "../api.js";

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [status, setStatus] = useState("loading"); // loading, notfound, error or success

  useEffect(() => {
    let ignore = false;
    setStatus("loading");

    fetch(`${API_URL}/books/${id}`)
      .then((res) => {
        // the server answers 404 for a missing book and 400 for something like /books/abc
        if (res.status === 404 || res.status === 400) {
          if (!ignore) setStatus("notfound");
          return null;
        }
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && !ignore) {
          setBook(data);
          setStatus("success");
        }
      })
      .catch(() => {
        if (!ignore) setStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  const backLink = (
    <Link to="/" className="back-link">
      &larr; Back to the catalog
    </Link>
  );

  if (status === "loading") {
    return (
      <>
        {backLink}
        <div className="detail" role="status" aria-label="Loading book">
          <div className="skeleton detail-cover" />
          <div className="detail-info">
            <div className="skeleton line big" />
            <div className="skeleton line" />
            <div className="skeleton line short" />
          </div>
        </div>
      </>
    );
  }

  if (status === "notfound") {
    return (
      <>
        {backLink}
        <div className="state-box">
          <h2>Book not found</h2>
          <p>We could not find a book with that id.</p>
        </div>
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        {backLink}
        <div className="state-box" role="alert">
          <h2>Could not load this book</h2>
          <p>Check that the server is running and try again.</p>
        </div>
      </>
    );
  }

  const available = book.availableCopies > 0;
  const coverColor = `hsl(${(book.genreId * 67) % 360} 45% 40%)`;

  return (
    <>
      {backLink}
      <article className="detail">
        <div className="detail-cover" style={{ backgroundColor: coverColor }}>
          {book.title.charAt(0)}
        </div>

        <div className="detail-info">
          <h1>{book.title}</h1>
          <p className="author">by {book.author}</p>

          <dl>
            <dt>Genre</dt>
            <dd>{book.genre?.name}</dd>
            <dt>ISBN</dt>
            <dd>{book.isbn}</dd>
            <dt>Copies</dt>
            <dd>
              {book.availableCopies} of {book.totalCopies} available
            </dd>
            <dt>Added to the library</dt>
            <dd>{new Date(book.createdAt).toLocaleDateString()}</dd>
          </dl>

          <span className={available ? "stock in-stock" : "stock out-of-stock"}>
            {available ? "Available to borrow" : "Currently unavailable"}
          </span>
        </div>
      </article>
    </>
  );
}

export default BookDetail;