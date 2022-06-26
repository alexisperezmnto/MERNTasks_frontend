import { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import axiosClient from '../config/axiosClient'

const AuthContext = createContext()

const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({})
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        const authUser = async () => {
            const token = localStorage.getItem('token')
            if(!token) {
                setLoading(false)
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const { data } = await axiosClient.get('/users/profile', config)
                setAuth(data)
                // navigate('/projects')
            } catch (error) {
                setAuth({})
                console.log(error)
            }

            setLoading(false)
        }

        authUser()
    }, [])

    const closeSessionAuth = () => {
        setAuth({})
    }

    if(loading) return <Loader />

    return (
        <AuthContext.Provider
            value={{
                auth,
                loading,
                setAuth,
                closeSessionAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext