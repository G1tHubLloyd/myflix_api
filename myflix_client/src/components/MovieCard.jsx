import React, { useState } from 'react'
import PropTypes from 'prop-types'

export default function MovieCard({ movie, selectedUser, onAddFavorite }) {
    const [status, setStatus] = useState(null)

    async function handleAddFavorite() {
        if (!selectedUser) {
            setStatus('Select a user first')
            return
        }
        setStatus('adding')
        const resp = await onAddFavorite(selectedUser._id, movie._id || movie.id)
        if (resp && resp.success) setStatus('added')
        else setStatus(resp.error || 'error')
    }

    return (
        <div className="movie-card">
            {movie.ImagePath && (
                <img src={movie.ImagePath} alt={movie.Title} />
            )}
            <h2>{movie.Title}</h2>
            <p>{movie.Description}</p>
            <div style={{ marginTop: 8 }}>
                <button onClick={handleAddFavorite}>Add to Favorites</button>
                {status && <span style={{ marginLeft: 8 }}>{status}</span>}
            </div>
        </div>
    )
}

MovieCard.propTypes = {
    movie: PropTypes.shape({
        _id: PropTypes.string,
        Title: PropTypes.string.isRequired,
        Description: PropTypes.string.isRequired,
        ImagePath: PropTypes.string,
    }).isRequired,
    selectedUser: PropTypes.object,
    onAddFavorite: PropTypes.func,
}

