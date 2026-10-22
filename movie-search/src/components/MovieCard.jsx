const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

function MovieCard({ movie, isFavorite, onToggleFavorite, onShowDetails }) {
    return (<article className="movie-card"> <div className="poster-wrap">
        {movie.poster_path ? (
            <img
                src={`${IMAGE_URL}${movie.poster_path}`}
                alt={`${movie.title} poster`}
                loading="lazy"
            />
        ) : (<div className="no-poster">🎬</div>
        )}

        <button
            type="button"
            className={`favorite-btn ${isFavorite ? "selected" : ""}`}
            onClick={() => onToggleFavorite(movie)}
            aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
            }
        >
            {isFavorite ? "♥" : "♡"}
        </button>

        <div className="rating">
            <span>★</span>{" "}
            {movie.vote_average
                ? movie.vote_average.toFixed(1)
                : "N/A"}
        </div>
    </div>

        <div className="movie-info">
            <h3 title={movie.title}>{movie.title}</h3>

            <div className="movie-meta">
                <span>
                    {movie.release_date
                        ? movie.release_date.slice(0, 4)
                        : "Release TBA"}
                </span>
                <span className="meta-dot">•</span>
                <span>Movie</span>
            </div>

            <p className="movie-overview">
                {movie.overview || "No description available."}
            </p>

            <button
                className="view-details-btn"
                onClick={() => onShowDetails(movie)}
            >
                ▶ View Details
            </button>
        </div>
    </article>

    );
}

export default MovieCard;
