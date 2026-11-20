// A grey placeholder shaped like a BookCard, shown while books load.
function BookCardSkeleton() {
  return (
    <div className="book-card skeleton-card" aria-hidden="true">
      <div className="cover skeleton" />
      <div className="skeleton line" />
      <div className="skeleton line short" />
    </div>
  );
}

export default BookCardSkeleton;