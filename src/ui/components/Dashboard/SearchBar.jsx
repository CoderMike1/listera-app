import './SearchBar.css'

const SearchBar = () =>{

    return (
        <div className="searchbar-container">
            <div className="input input--search">
                <span aria-hidden="true">🔍</span>
                <input placeholder="Search" aria-label="Search"/>
            </div>
        </div>
    )

}

export default SearchBar