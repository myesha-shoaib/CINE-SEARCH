import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_URL = "https://api.themoviedb.org/3";

function MovieDetail({ movie, onClose }) {
    const [trailer, setTrailer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!movie) return;

        const fetchTrailer = async () => {
            setLoading(true);
            setTrailer(null);

            try {
                const response = await fetch(
                    `${API_URL}/movie/${movie.id}/videos?api_key=${API_KEY}`
                );

                if (!response.ok) {
                    throw new Error("Trailer fetch failed");
                }

                const data = await response.json();

                const videos = data.results || [];

                const selectedTrailer =
                    videos.find(
                        (video) =>
                            video.site === "YouTube" &&
                            video.type === "Trailer" &&
                            video.official
                    ) ||
                    videos.find(
                        (video) =>
                            video.site === "YouTube" &&
                            video.type === "Trailer"
                    ) ||
                    videos.find(
                        (video) =>
                            video.site === "YouTube" &&
                            video.type === "Teaser"
                    );

                setTrailer(selectedTrailer || null);
            } catch (error) {
                console.error("Trailer error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrailer();

    }, [movie]);

    if (!movie) return null;

    return (<div className="movie-detail-overlay" onClick={onClose}>
        <div
            className="movie-detail-modal"
            onClick={(event) => event.stopPropagation()}
        > <button
            className="movie-detail-close"
            onClick={onClose}
            aria-label="Close movie details"
        >
                ✕ </button>

            <h2>{movie.title}</h2>

            <p className="movie-detail-overview">
                {movie.overview || "No description available."}
            </p>

            {loading ? (
                <p>Loading trailer...</p>
            ) : trailer ? (
                <div className="trailer-container">
                    <iframe
                        src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0`}
                        title={`${movie.title} trailer`}
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            ) : (
                <p>Sorry, trailer is not available for this movie.</p>
            )}
        </div>
    </div>

    );
}

export default MovieDetail;
