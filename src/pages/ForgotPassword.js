import axiosClient from '../config/axiosClient'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Alert from '../components/Alert'
import useAuth from '../hooks/useAuth'

const ForgotPassword = () => {

  const navigate = useNavigate()

  const [ email, setEmail ] = useState('')
  const [alert, setAlert] = useState({})

  const { auth } = useAuth()

  useEffect(() => {
    if(auth?._id) {
      navigate('/projects')
    }
  }, [])
  
  const handleSubmit = async e => {
    e.preventDefault()

    if(email === '' || email.length < 6) {
      setAlert({
        msg: 'El email es obligatorio',
        error: true
      })
      
      return
    }

    try {
      const { data } = await axiosClient.post(`/users/forgot-password`, {email})
      
      setAlert({
        msg: data.msg,
        error: false
      })

      setEmail('')
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
        Recupera Tu Acceso y No Pierdas Tus 
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
        <input 
          type='submit' 
          value='Enviar'
          className='bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors'
        />
      </form>

      <nav className='lg:flex lg:justify-between'>
        <Link
          to='/'
          className='block text-center my-5 text-slate-500 uppercase text-sm'
        >
          ??Ya tienes una cuenta? Inicia Sesi??n
        </Link>

        <Link
          to='/register'
          className='block text-center my-5 text-slate-500 uppercase text-sm'
        >
          ??No tienes una cuenta? Reg??strate
        </Link>
      </nav>
    </>
  )
}

export default ForgotPassword