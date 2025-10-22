import React, { useEffect, useState, createContext, useContext } from 'react'
type Theme = 'light' | 'dark' | 'system'
interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
export const ThemeProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme
    return savedTheme || 'light'
  })
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      setResolvedTheme(systemTheme)
      root.classList.remove('light', 'dark')
      root.classList.add(systemTheme)
    } else {
      setResolvedTheme(theme)
      root.classList.remove('light', 'dark')
      root.classList.add(theme)
    }
  }, [theme])
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
  }
  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        resolvedTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
