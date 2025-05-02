import React, { useState, useEffect, useCallback } from "react";
import BookCard from "./BookCard";
import FileUploader from "./FileUploader";


const RESULTS_PER_PAGE = 10;
const RECOMMENDED_QUERY = "bestsellers";

export default function BookSearch() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [recIndex, setRecIndex] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");
  const [error, setError] = useState(null);

  const sortBooks = useCallback(
    list => [...list].sort((a, b) => {
      const ta = a.title?.toLowerCase() || "";
      const tb = b.title?.toLowerCase() || "";
      return sortOrder === "asc" ? ta.localeCompare(tb) : tb.localeCompare(ta);
    }),
    [sortOrder]
  );

  const fetchBooks = useCallback(async (term, index = 0) => {
    if (!term) return;
    try {
      const page = Math.floor(index / RESULTS_PER_PAGE) + 1;
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(term)}&page=${page}`);
      const data = await res.json();
      setBooks(sortBooks((data.docs || []).slice(0, RESULTS_PER_PAGE)));
    } catch {
      setError("Failed to fetch book data");
    }
  }, [sortBooks]);

  const fetchRecommended = useCallback(async () => {
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(RECOMMENDED_QUERY)}&page=${recIndex + 1}`);
      const data = await res.json();
      setRecommendedBooks(sortBooks((data.docs || []).slice(0, RESULTS_PER_PAGE)));
    } catch {}
  }, [sortBooks, recIndex]);

  useEffect(() => { fetchRecommended(); }, [fetchRecommended]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) fetchBooks(query, startIndex);
      else setBooks([]);
    }, 400);
    return () => clearTimeout(delay);
  }, [query, fetchBooks, startIndex]);

  const handlePrev = () => {
    if (query && startIndex >= RESULTS_PER_PAGE) setStartIndex(i => i - RESULTS_PER_PAGE);
    else if (!query && recIndex > 0) setRecIndex(i => i - 1);
  };

  const handleNext = () => {
    if (query) setStartIndex(i => i + RESULTS_PER_PAGE);
    else setRecIndex(i => i + 1);
  };

  const renderBooks = (list, queryText) => (
    <div className="box">
      <div className="headers-row">
        <div className="title-header header-box">Title</div>
        <div className="author-header header-box">Author(s)</div>
        <div className="date-header header-box">First Published</div>
      </div>
      {error ? (
        <div className="table-message">{error}</div>
      ) : list.length === 0 && queryText.trim() ? (
        <div className="table-message">
          There is no matched result for "{queryText}"
        </div>
      ) : (
        list.map((b, i) => (
          <BookCard
            key={i}
            title={b.title || "No title"}
            authors={(b.author_name || ["Unknown author"]).join(", ")}
            publishedDate={b.first_publish_year || "Unknown"}
          />
        ))
      )}
    </div>
  );

  return (
    <div className="container">
      <h1 className="book-title">📖 Find Your Next Great Read </h1>
      <p className="book-quote">"Your next favorite story is just a few keystrokes away."</p>
      <div className="search-space-bottom">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setStartIndex(0); }}
          placeholder="Search for books..." className="search-bar"/>

        <button onClick={() => setSortOrder(o => o === "asc" ? "desc" : "asc")} className="toggle-box">
          Toggle Order ({sortOrder})
        </button>
      </div>

      {!query.trim()
        ? (<><h2>Highlighted Reads</h2>{renderBooks(recommendedBooks, RECOMMENDED_QUERY)}</>)
        : (<><h2>Search Results for "{query}"</h2>{renderBooks(books, query)}</>)}

      <div className="pagination-container">
        <button onClick={handlePrev} className="pagination-button">Previous</button>
        <div className="pagination-info">Page {query ? Math.floor(startIndex / RESULTS_PER_PAGE) + 1 : recIndex + 1}</div>
        <button onClick={handleNext} className="pagination-button">Next</button>
      </div>
      <FileUploader />
    </div>
  );
}
