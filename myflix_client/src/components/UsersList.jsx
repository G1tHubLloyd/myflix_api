import React from 'react'

export default function UsersList({ users, selectedUser, onSelect }) {
    if (!users || users.length === 0) return <div>No users yet.</div>
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {users.map(u => (
                <button key={u._id} onClick={() => onSelect(u)} style={{ textAlign: 'left', background: selectedUser && selectedUser._id === u._id ? '#def' : '#fff' }}>
                    {u.Username} ({u.Email})
                </button>
            ))}
        </div>
    )
}
