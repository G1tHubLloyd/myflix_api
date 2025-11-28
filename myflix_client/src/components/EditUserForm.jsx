import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'

function isValidEmail(v) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)
}

function isValidDateYMD(v) {
    if (!v) return true
    // simple YYYY-MM-DD check
    const m = /^\d{4}-\d{2}-\d{2}$/.test(v)
    if (!m) return false
    const d = new Date(v)
    return !Number.isNaN(d.getTime())
}

export default function EditUserForm({ user, onCancel, onSave }) {
    const [username, setUsername] = useState(user.Username || '')
    const [email, setEmail] = useState(user.Email || '')
    const [birthday, setBirthday] = useState(user.Birthday || '')
    const [status, setStatus] = useState(null)

    const errors = useMemo(() => {
        const e = {}
        if (!username || username.trim().length < 3) e.username = 'Username must be at least 3 characters.'
        if (!email || !isValidEmail(email)) e.email = 'Enter a valid email address.'
        if (birthday && !isValidDateYMD(birthday)) e.birthday = 'Birthday must be YYYY-MM-DD.'
        return e
    }, [username, email, birthday])

    const canSave = Object.keys(errors).length === 0

    async function handleSubmit(e) {
        e.preventDefault()
        if (!canSave) return
        setStatus('saving')
        try {
            await onSave(user._id, { Username: username.trim(), Email: email.trim(), Birthday: birthday.trim() })
            setStatus('saved')
        } catch (err) {
            setStatus(`error: ${err?.message || err}`)
            throw err
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h4>Edit User</h4>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                        {errors.username && <div className="error">{errors.username}</div>}
                    </div>
                    <div>
                        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        {errors.email && <div className="error">{errors.email}</div>}
                    </div>
                    <div>
                        <input placeholder="Birthday (YYYY-MM-DD)" value={birthday} onChange={e => setBirthday(e.target.value)} />
                        {errors.birthday && <div className="error">{errors.birthday}</div>}
                    </div>
                    <div style={{ marginTop: 8 }}>
                        <button type="submit" disabled={!canSave}>Save</button>
                        <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>
                    </div>
                    {status && <div style={{ marginTop: 8 }}>{status}</div>}
                </form>
            </div>
        </div>
    )
}

EditUserForm.propTypes = {
    user: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
}
