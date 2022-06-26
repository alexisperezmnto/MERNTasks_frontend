import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useProjects from '../hooks/useProjects'

import Alert from '../components/Alert'

const ProjectForm = () => {

    const [id, setId] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [deliveryDate, setDeliveryDate] = useState('')
    const [customer, setCustomer] = useState('')

    const params = useParams()
    
    //Context
    const { alert, project, submitProject, showAlert } = useProjects()
    
    useEffect(() => {
        if(params.id) {
            setId(project._id)
            setName(project.name)
            setDescription(project.description)
            setDeliveryDate(project.deliveryDate?.split('T')[0])
            setCustomer(project.customer)
        } 
    }, [params])
    


    const handleSubmit = async e => {
        e.preventDefault()

        if([name, description, deliveryDate, customer].includes('')) {
            showAlert({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
            
            return
        }

        await submitProject({id, name, description, deliveryDate, customer})
    }

    const { msg } = alert

    return (
        <form
            className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow'
            onSubmit={handleSubmit}
        >   

            {msg && <Alert alert={alert} />}

            <div className='mb-5'>
                <label 
                    className='text-gray-700 uppercase font-bold text-sm'
                    htmlFor='name'
                >
                    Nombre
                </label>

                <input 
                    type='text' 
                    className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    id='name'
                    placeholder='Nombre del proyecto'
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>

            <div className='mb-5'>
                <label 
                    className='text-gray-700 uppercase font-bold text-sm'
                    htmlFor='description'
                >
                    Descripción
                </label>

                <textarea 
                    className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md resize-none'
                    id='description'
                    placeholder='Descripción del proyecto'
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </div>

            <div className='mb-5'>
                <label 
                    className='text-gray-700 uppercase font-bold text-sm'
                    htmlFor='deliveryDate'
                >
                    Fecha de Entrega
                </label>

                <input 
                    type='date' 
                    className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    id='deliveryDate'
                    value={deliveryDate}
                    onChange={e => setDeliveryDate(e.target.value)}
                />
            </div>

            <div className='mb-5'>
                <label 
                    className='text-gray-700 uppercase font-bold text-sm'
                    htmlFor='customer'
                >
                    Cliente
                </label>

                <input 
                    type='text' 
                    className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    id='customer'
                    placeholder='Nombre del cliente'
                    value={customer}
                    onChange={e => setCustomer(e.target.value)}
                />
            </div>

            <input 
                type='submit' 
                value={id ? 'Actualizar' : 'Guardar'}
                className='bg-sky-600 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-700 transition-colors'
            />
        </form>
    )
}

export default ProjectForm