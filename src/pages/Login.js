import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import axiosClient from '../config/axiosClient'
import useAuth from '../hooks/useAuth'

const Login = () => {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alert, setAlert] = useState({})
  
  //Hook Context API
  const { setAuth } = useAuth()

  const handleSubmit = async e => {
    e.preventDefault()

    if([email, password].includes('')) {
      setAlert({
        msg: 'Todos los campos son obligatorios',
        error: true
      })

      return
    }

    try {
      const url = '/users/login'
      const { data} = await axiosClient.post(url, {email, password})
      localStorage.setItem('token', data.token)
      setAlert({})
      setAuth(data)
      navigate('/projects')
    } catch (error) {
      setAlert({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const { msg } = alert

  return (
    <>
      <h1 className='text-sky-600 font-black text-4xl text-center'>
        Inicia Sesión y Administra Tus 
        <span className='text-slate-700'> Proyectos</span>
      </h1>

      {msg && <Alert alert={alert} />}

      <form 
        className='my-10 bg-white shadow rounded-lg p-10'
        onSubmit={handleSubmit}  
      >
        <div className='my-5'>
          <label 
            htmlFor='email'
            className='uppercase text-gray-600 block text-sm font-bold'
          >
            Email
          </label>
          <input 
            type='email' 
            id='email'
            placeholder='Email'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className='my-5'>
          <label 
            htmlFor='password'
            className='uppercase text-gray-600 block text-sm font-bold'
          >
            Password
          </label>
          <input 
            type='password' 
            id='password'
            placeholder='Password'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <input 
          type='submit' 
          value='Iniciar Sesión'
          className='bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors'
        />
      </form>

      <nav className='lg:flex lg:justify-between'>
        <Link
          to='/register'
          className='block text-center my-5 text-slate-500 uppercase text-sm'
        >
          ¿No tienes una cuenta? Regístrate
        </Link>

        <Link
          to='/forgot-password'
          className='block text-center my-5 text-slate-500 uppercase text-sm'
        >
          Olvidé mi password
        </Link>
      </nav>
    </>
  )
}

export default Login