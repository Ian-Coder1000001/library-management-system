import { useState, useEffect } from "react";

// Waits until the user stops typing for 400ms before telling the parent.
function SearchBar({ onSearch }) {
  const [text, setText] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(text.trim());
    }, 400);

    // if the user types again before 400ms, cancel the old timer
    return () => clearTimeout(timer);
  }, [text, onSearch]);

  return (
    <label className="field grow">
      <span>Search</span>
      <input
        type="search"
        placeholder="Title or author..."
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
    </label>
  );
}

export default SearchBar;