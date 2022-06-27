import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axiosClient from '../config/axiosClient'

import Alert from '../components/Alert'
import useAuth from '../hooks/useAuth'

const ConfirmAccount = () => {

  const navigate = useNavigate()

  const [alert, setAlert] = useState({})
  const [confirmedAccount, setConfirmedAccount] = useState(false)

  const params = useParams()
  const { id } = params

  const { auth } = useAuth()

  useEffect(() => {
    
  }, [])

  useEffect(() => {
    const confirmAccount = async () => {

      if(auth?._id) {
        navigate('/projects')
      } else {
        try {
          const url = `/users/confirm/${id}`
          const { data } = await axiosClient(url)
          
          setAlert({
            msg: data.msg,
            error: false
          })

          setConfirmedAccount(true)

        } catch (error) {
          setAlert({
            msg: error.response.data.msg,
            error: true
          })
        }
      }
    }

    confirmAccount()
  }, [])
  
  const { msg } = alert

  return (
    <>
      <h1 className='text-sky-600 font-black text-4xl text-center'>
        Confirma Tu Cuenta y Comienza a Administrar Tus
        <span className='text-slate-700'> Proyectos</span>
      </h1>

      <div className='mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white'>
        {msg && <Alert alert={alert} />}

        {confirmedAccount && (
          <Link
            to='/'
            className='block text-center my-5 text-slate-500 uppercase text-sm'
          >
            Inicia Sesión
          </Link>
        )}
      </div>
    </>
  )
}

export default ConfirmAccount