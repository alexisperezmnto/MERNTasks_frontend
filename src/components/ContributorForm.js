import { useState } from 'react'
import useProjects from '../hooks/useProjects'
import Alert from './Alert'


const ContributorForm = () => {

    const {alert, showAlert, submitContributor} = useProjects()

    const [email, setEmail] = useState('')

    const handleSubmit = async e => {
        e.preventDefault()

        if(email === '') {
            showAlert({
                msg: 'El email es obligatorio',
                error: true
            })

            return
        }

        await submitContributor({email})
    }

    const {msg} = alert

    return (
        <form
            className='bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow'
            onSubmit={handleSubmit}
        >

            {msg && <Alert alert={alert} />}

            <div className='mb-5'>
                <label 
                    htmlFor='email'
                    className='text-gray-700 uppercase font-bold text-sm'
                >Email Colaborador</label>

                <input
                    type='email'
                    id='email'
                    placeholder='Email del Colaborador'
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>

            <input 
                type='submit' 
                className='bg-sky-600 hover:bg-sky-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded text-sm'
                value='Buscar Colaborador'
            />
        </form>
    )
}

export default ContributorForm