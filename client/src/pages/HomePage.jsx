import { useState, useCallback } from "react";
import SearchBar from "../components/SearchBar.jsx";
import GenreFilter from "../components/GenreFilter.jsx";
import BookGrid from "../components/BookGrid.jsx";

// This page owns the filter state. The children just report changes up to it.
function HomePage() {
  const [genreId, setGenreId] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("title");
  const [page, setPage] = useState(1);

  // any change to the filters sends us back to page 1
  const handleSearch = useCallback((text) => {
    setSearch(text);
    setPage(1);
  }, []);

  function handleGenre(id) {
    setGenreId(id);
    setPage(1);
  }

  function handleSort(event) {
    setSort(event.target.value);
    setPage(1);
  }

  return (
    <>
      <h1>Browse books</h1>

      <div className="controls">
        <SearchBar onSearch={handleSearch} />
        <GenreFilter value={genreId} onChange={handleGenre} />
        <label className="field">
          <span>Sort by</span>
          <select value={sort} onChange={handleSort}>
            <option value="title">Title</option>
            <option value="author">Author</option>
          </select>
        </label>
      </div>

      <BookGrid
        genreId={genreId}
        search={search}
        sort={sort}
        page={page}
        onPageChange={setPage}
      />
    </>
  );
}

export default HomePage;