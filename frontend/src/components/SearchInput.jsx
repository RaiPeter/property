import React from 'react'
import "./SearchInput.css"
import SearchIcon from "../assets/search.png"

const SearchInput = () => {
  return (
    <div className='search-input'>
        <img src={SearchIcon} alt='search icons' />
        <input type='text' placeholder='Search'/>
    </div>
  )
}

export default SearchInput
