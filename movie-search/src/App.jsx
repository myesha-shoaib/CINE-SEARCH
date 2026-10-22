import { useEffect, useState } from "react";
import "./styles.css";
import MovieCard from "./components/MovieCard";
import MovieDetail from "./components/MovieDetails";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const API_URL = "https://api.themoviedb.org/3";

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("movie-favorites")) || [];
    } catch {
      return [];
    }
  });
  const [showFavorites, setShowFavorites] = useState(false);

  async function fetchMovies(query = "") {
    const trimmedQuery = query.trim();

    if (!API_KEY) {
      setError("API key missing. Check your .env file.");
      setMovies([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const endpoint = trimmedQuery ? "search/movie" : "movie/popular";

      const params = new URLSearchParams({
        api_key: API_KEY,
        language: "en-US",
        page: "1",
      });

      if (trimmedQuery) {
        params.set("query", trimmedQuery);
      }

      const response = await fetch(
        `${API_URL}/${endpoint}?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.status_message || `TMDB error: ${response.status}`
        );
      }

      setMovies(data.results || []);

      if (trimmedQuery && (!data.results || data.results.length === 0)) {
        setError(`No movies found for "${trimmedQuery}". Try another title.`);
      }
    } catch (err) {
      console.error("Movie fetch error:", err);
      setMovies([]);
      setError(err.message || "Could not load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    localStorage.setItem("movie-favorites", JSON.stringify(favorites));
  }, [favorites]);

  function handleSearch(e) {
    e.preventDefault();
    setShowFavorites(false);
    fetchMovies(search);
  }

  function toggleFavorite(movie) {
    setFavorites((previous) =>
      previous.some((item) => item.id === movie.id)
        ? previous.filter((item) => item.id !== movie.id)
        : [...previous, movie]
    );
  }

  const displayedMovies = showFavorites ? favorites : movies;
  return (
    <div className="app">
      <Navbar
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        onHome={() => {
          setShowFavorites(false);
          setSearch("");
          fetchMovies();
        }}
      />

      <main id="home">
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">YOUR NEXT MOVIE NIGHT STARTS HERE</span>

            <h1>
              Discover Your
              <br />
              Next <span>Favorite Film.</span>
            </h1>

            <p>
              Explore popular movies, discover hidden gems, and build your
              personal collection of favorites.
            </p>

            <SearchBar
              search={search}
              setSearch={setSearch}
              onSearch={handleSearch}
            />

            <div className="hero-stats">
              <div>
                <strong>Discover</strong>
                <span>New stories</span>
              </div>
              <div>
                <strong>Explore</strong>
                <span>Every genre</span>
              </div>
              <div>
                <strong>Save</strong>
                <span>Your favorites</span>
              </div>
            </div>
          </div>

          <div className="hero-decoration" aria-hidden="true">
            <div className="film-circle">▶</div>
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>
            <span className="floating-star star-one">✦</span>
            <span className="floating-star star-two">✧</span>
            <span className="floating-star star-three">✦</span>
          </div>
        </section>

        <section className="movies-section">
          <div className="section-heading">
            <div>
              <span className="section-label">
                {showFavorites ? "YOUR COLLECTION" : "HANDPICKED FOR YOU"}
              </span>

              <h2>
                {showFavorites
                  ? "Your Favorites"
                  : search.trim()
                    ? "Search Results"
                    : "Popular Movies"}
              </h2>
            </div>

            <span className="movie-count">
              {displayedMovies.length} movies
            </span>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Finding amazing movies...</p>
            </div>
          ) : error ? (
            <div className="message">
              <span>🎬</span>
              <h3>{error}</h3>

              {!API_KEY && (
                <p>
                  Create a .env file in your project root and add your TMDB API
                  key.
                </p>
              )}

              {API_KEY && (
                <button
                  className="retry-btn"
                  onClick={() => fetchMovies(search)}
                >
                  Try Again
                </button>
              )}
            </div>
          ) : displayedMovies.length === 0 ? (
            <div className="message">
              <span>♡</span>
              <h3>
                {showFavorites
                  ? "Your collection is waiting!"
                  : "No movies found"}
              </h3>
              <p>
                {showFavorites
                  ? "Tap the heart on any movie to save it here."
                  : "Try searching for another movie."}
              </p>
            </div>
          ) : (
            <div className="movie-grid">
              {displayedMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isFavorite={favorites.some(
                    (item) => item.id === movie.id
                  )}
                  onToggleFavorite={toggleFavorite}
                  onShowDetails={(selectedMovie) =>
                    setSelectedMovie(selectedMovie)
                  }
                />
              ))}
            </div>
          )}
        </section>

        {selectedMovie && (
          <MovieDetail
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </main>

      <footer>
        <a href="#home" className="footer-logo">
          ▶ CineSearch
        </a>
        <p>Find your next favorite story. 🎬</p>
      </footer>
    </div>
  );
}

export default App;