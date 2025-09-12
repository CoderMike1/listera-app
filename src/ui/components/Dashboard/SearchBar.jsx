import './SearchBar.css'

const SearchBar = ({setQuery,query,placeholder}) =>{

    return (
        <div className="searchbar-container">
            <div className="input input--search">
                <span aria-hidden="true">🔍</span>
                <input
                    placeholder={placeholder}
                    aria-label="Search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
            </div>
        </div>
    )

}

export default SearchBar