function SearchBar({ search, setSearch, onSearch }) {
    return (<form className="search-form" onSubmit={onSearch}> <span className="search-icon">⌕</span>

        <input
            type="search"
            placeholder="Search movies by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search movies"
        />

        <button type="submit">Search</button>
    </form>


    );
}

export default SearchBar;
