import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import BookDetail from "./pages/BookDetail.jsx";

function App() {
  return (
    <>
      <header className="site-header">
        <div className="container">
          <Link to="/" className="logo">
            Library Catalog
          </Link>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route
            path="*"
            element={
              <div className="state-box">
                <h2>Page not found</h2>
                <Link to="/">Back to the catalog</Link>
              </div>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;