import React from 'react'
import PropTypes from 'prop-types'
import MovieCard from './MovieCard'

export default function MoviesList({ movies, selectedUser, onAddFavorite }) {
    if (!movies || movies.length === 0) return <div>No movies found.</div>

    return (
        <div className="movies-grid">
            {movies.map((m) => (
                <MovieCard key={m._id || m.id} movie={m} selectedUser={selectedUser} onAddFavorite={onAddFavorite} />
            ))}
        </div>
    )
}

MoviesList.propTypes = {
    movies: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedUser: PropTypes.object,
    onAddFavorite: PropTypes.func,
}
