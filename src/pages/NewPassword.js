import axiosClient from '../config/axiosClient'
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

import Alert from '../components/Alert'

const NewPassword = () => {

  const params = useParams()
  const { token } = params

  const [password, setPassword] = useState('')
  const [alert, setAlert] = useState({})
  const [validToken, setValidToken] = useState(false)
  const [passwordModified, setPasswordModified] = useState(false)

  useEffect(() => {
    const checkToken = async () => {
      
      try {
        await axiosClient(`/users/forgot-password/${token}`)
        setValidToken(true)
      } catch (error) {
        setAlert({
          msg: error.response.data.msg,
          error: true
        })
      }
    }

    checkToken()
  }, [])
  
  const handleSubmit = async e => {
    e.preventDefault()

    if(password.length < 6) {
      setAlert({
        msg: 'El password debe tener mínimo 6 caracteres',
        error: true
      })
      return
    }

    try {
      const url = `/users/forgot-password/${token}`;

      const { data } = await axiosClient.post(url, {password})

      setAlert({
        msg: data.msg,
        error: false
      })

      setPasswordModified(true)

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
        Restablece Tu Password
      </h1>

      {msg && <Alert alert={alert} />}

      {passwordModified && (
        <Link
          to='/'
          className='block text-center my-5 text-slate-500 uppercase text-sm'
        >
          Inicia Sesión
        </Link>
      )}
        
      {(validToken && !passwordModified) && (
        <form 
          className='my-10 bg-white shadow rounded-lg p-10'
          onSubmit={handleSubmit}
        >
          <div className='my-5'>
            <label 
              htmlFor='password'
              className='uppercase text-gray-600 block text-sm font-bold'
            >
              Nuevo Password
            </label>
            <input 
              type='password' 
              id='password'
              placeholder='Nuevo Password'
              className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <input 
            type='submit' 
            value='Guardar'
            className='bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors'
          />
        </form>
      )}
    </>
  )
}

export default NewPassword