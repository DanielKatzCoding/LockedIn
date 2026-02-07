"use client"

import { useTheme } from 'next-themes'
import { ToastContainer } from 'react-toastify'

const ToastConfigured = () => {
  const { resolvedTheme } = useTheme();

  return (
    <ToastContainer 
      key={resolvedTheme} // This forces a refresh when the theme swaps
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'} 
      position="bottom-right" 
      autoClose={3000} 
    />    
  )
}

export default ToastConfigured