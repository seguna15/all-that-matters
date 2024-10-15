import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { Spinner } from '../../components'
import { motion } from 'framer-motion'
import { formatDate } from '../../shared/utils/date'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/common/Sidebar'

export const AdminDashboard = () => {
    const { isLoading, userProfile, fetchUser, logout } = useAuthStore();
    
    useEffect(() => {
        fetchUser()
    },[fetchUser])

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
    }
  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex h-screen overflow-hidden text-gray-100 bg-gray-900">
          {/* BG */}
          <div className="fixed inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
            <div className="absolute inset-0 backdrop-blur-sm" />
          </div>

          <Sidebar />
          {/* main content */}
          <Outlet/>
        </div>
      )}
    </div>
  );
}
