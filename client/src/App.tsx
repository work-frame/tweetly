import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { RequireAuth } from './components/RequireAuth'
import { MainLayout } from './layouts/MainLayout'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Feed } from './pages/Feed'
import { Profile } from './pages/Profile'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <MainLayout>
                    <Feed />
                  </MainLayout>
                </RequireAuth>
              }
            />
            <Route
              path="/profile/:username"
              element={
                <RequireAuth>
                  <MainLayout>
                    <Profile />
                  </MainLayout>
                </RequireAuth>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App