import { Link } from "react-router-dom";

function BookCard({ book }) {
  const available = book.availableCopies > 0;
  // the book has no cover image, so we make a coloured block from the genre id
  const coverColor = `hsl(${(book.genreId * 67) % 360} 45% 40%)`;

  return (
    <Link to={`/books/${book.id}`} className="book-card">
      <div className="cover" style={{ backgroundColor: coverColor }}>
        {book.title.charAt(0)}
      </div>
      <h3>{book.title}</h3>
      <p className="author">{book.author}</p>
      <div className="card-footer">
        <span className="badge">{book.genre?.name}</span>
        <span className={available ? "stock in-stock" : "stock out-of-stock"}>
          {available ? `${book.availableCopies} available` : "Unavailable"}
        </span>
      </div>
    </Link>
  );
}

export default BookCard;