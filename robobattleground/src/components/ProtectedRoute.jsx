import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { IconLoader } from '@tabler/icons-react'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#080808] flex items-center justify-center z-50 select-none">
        <div className="flex flex-col items-center gap-4">
          <IconLoader className="animate-spin text-fire" size={48} />
          <span className="font-display text-sm tracking-widest text-ash uppercase">
            Recovering Secure Session...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return children;
}
