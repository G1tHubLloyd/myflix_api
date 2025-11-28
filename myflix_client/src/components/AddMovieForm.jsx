import React, { useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../config'

export default function AddMovieForm({ onMovieAdded }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [imagePath, setImagePath] = useState('')
    const [status, setStatus] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        setStatus('loading')
        try {
            const payload = { Title: title, Description: description, ImagePath: imagePath }
            const res = await axios.post(`${API_BASE}/movies`, payload)
            const data = res.data
            setStatus('created')
            setTitle('')
            setDescription('')
            setImagePath('')
            if (onMovieAdded) onMovieAdded(data)
        } catch (err) {
            setStatus(`error: ${err.message}`)
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
            <div>
                <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div>
                <input placeholder="ImagePath (URL)" value={imagePath} onChange={e => setImagePath(e.target.value)} />
            </div>
            <div>
                <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
            <div style={{ marginTop: 8 }}>
                <button type="submit">Add Movie</button>
            </div>
            {status && <div style={{ marginTop: 8 }}>{status}</div>}
        </form>
    )
}
