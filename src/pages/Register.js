import { useState } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../config/axiosClient'

import Alert from '../components/Alert'

const Register = () => {

  const [ name, setName ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ confirmPassword, setConfirmPassword ] = useState('')
  const [ alert, setAlert ] = useState({})

  const handleSubmit = async e => {
    e.preventDefault()

    if([name, email, password, confirmPassword].includes('')) {
      setAlert({
        msg: 'Todos los campos son obligatorios',
        error: true
      })
      return
    }

    if(password.length < 6) {
      setAlert({
        msg: 'El password debe tener mínimo 6 caracteres',
        error: true
      })
      return
    }

    if(password !== confirmPassword) {
      setAlert({
        msg: 'Los passwords no son iguales',
        error: true
      })
      return
    }

    setAlert({})

    //Register user
    try {
      const { data } = await axiosClient.post(`/users`, {name, email, password})
      
      setAlert({
        msg: data.msg,
        error: false
      })

      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      
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
        Crea Tu Cuenta y Administra Tus 
        <span className='text-slate-700'> Proyectos</span>
      </h1>

      {msg && <Alert alert={alert} />}

      <form 
        onSubmit={handleSubmit}
        className='my-10 bg-white shadow rounded-lg p-10'
      >
        <div className='my-5'>
          <label 
            htmlFor='name'
            className='uppercase text-gray-600 block text-sm font-bold'
          >
            Nombre
          </label>
          <input 
            type='text' 
            id='name'
            placeholder='Name'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
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
        <div className='my-5'>
          <label 
            htmlFor='password2'
            className='uppercase text-gray-600 block text-sm font-bold'
          >
            Repetir Password
          </label>
          <input 
            type='password' 
            id='password2'
            placeholder='Repetir password'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>
        <input 
          type='submit' 
          value='Crear Cuenta'
          className='bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors'
        />
      </form>

      <nav className='lg:flex lg:justify-between'>
        <Link
          to='/'
          className='block text-center my-5 text-slate-500 uppercase text-sm'
        >
          ¿Ya tienes una cuenta? Inicia Sesión
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

export default Register