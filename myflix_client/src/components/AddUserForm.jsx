import React, { useState } from 'react'
import axios from 'axios'
import { API_BASE } from '../config'

export default function AddUserForm({ onUserAdded }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [birthday, setBirthday] = useState('')
    const [status, setStatus] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        setStatus('loading')
        try {
            const res = await axios.post(`${API_BASE}/users`, { Username: username, Password: password, Email: email, Birthday: birthday })
            const data = res.data
            setStatus('created')
            setUsername('')
            setPassword('')
            setEmail('')
            setBirthday('')
            if (onUserAdded) onUserAdded(data)
        } catch (err) {
            setStatus(`error: ${err.message}`)
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
            <h3>Create User</h3>
            <div>
                <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div>
                <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div>
                <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
                <input placeholder="Birthday (YYYY-MM-DD)" value={birthday} onChange={e => setBirthday(e.target.value)} />
            </div>
            <div style={{ marginTop: 8 }}>
                <button type="submit">Create User</button>
            </div>
            {status && <div style={{ marginTop: 8 }}>{status}</div>}
        </form>
    )
}
