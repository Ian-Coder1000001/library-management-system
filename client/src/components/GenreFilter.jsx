import { useState, useEffect } from "react";
import { API_URL } from "../api.js";

function GenreFilter({ value, onChange }) {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    let ignore = false;

    fetch(`${API_URL}/genres`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) setGenres(data);
      })
      // if this fails the dropdown just only shows "All genres"
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <label className="field">
      <span>Genre</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">All genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export default GenreFilter;