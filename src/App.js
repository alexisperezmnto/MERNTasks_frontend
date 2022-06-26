import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import {useLayoutEffect} from 'react'

import AuthLayout from './layouts/AuthLayout'
import ConfirmAccount from './pages/ConfirmAccount'
import ForgotPassword from './pages/ForgotPassword'
import Login from './pages/Login'
import NewPassword from './pages/NewPassword'
import Register from './pages/Register'
import ProtectedRoute from './layouts/ProtectedRoute'
import Projects from './pages/Projects'
import NewProject from './pages/NewProject'
import Project from './pages/Project'
import NewContributor from './pages/NewContributor'

import {AuthProvider} from './context/AuthProvider'
import {ProjectsProvider} from './context/ProjectsProvider'
import EditProject from './components/EditProject'

const Wrapper = ({children}) => {
  const location = useLocation()
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0)
  }, [location.pathname])
  return children
} 

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProjectsProvider>
          <Wrapper>
            <Routes>
              <Route path='/' element={<AuthLayout />}>
                <Route index element={<Login />} />
                <Route path='register' element={<Register />} />
                <Route path='forgot-password' element={<ForgotPassword />} />
                <Route path='forgot-password/:token' element={<NewPassword />} />
                <Route path='confirm-account/:id' element={<ConfirmAccount />} />
              </Route>

              <Route path='/projects' element={<ProtectedRoute />}>
                <Route index element={<Projects />} />
                <Route path='create-project' element={<NewProject />} />
                <Route path='new-contributor/:id' element={<NewContributor />} />
                <Route path=':id' element={<Project />} />
                <Route path='edit/:id' element={<EditProject />} />
              </Route>
            </Routes>
          </Wrapper>
        </ProjectsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
