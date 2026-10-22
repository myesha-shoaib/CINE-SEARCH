function Navbar({ showFavorites, setShowFavorites, onHome }) {
    return (<header className="navbar"> <a href="#home" className="logo" onClick={onHome}> <span className="logo-icon">▶</span> CineSearch </a>
        <nav>
            <button
                className={!showFavorites ? "nav-link active" : "nav-link"}
                onClick={onHome}
            >
                Home
            </button>

            <button
                className={showFavorites ? "nav-link active" : "nav-link"}
                onClick={() => setShowFavorites(true)}
            >
                Favorites
            </button>
        </nav>
    </header>

    );
}

export default Navbar;
