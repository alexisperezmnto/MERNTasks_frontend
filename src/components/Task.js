import { formatDate } from '../helpers/formatDate'
import useProjects from '../hooks/useProjects'
import useAdmin from '../hooks/useAdmin'

const Task = ({task}) => {

    const { handleModalEditTask, handleModalDeleteTask, completeTask } = useProjects()
    const admin = useAdmin()

    const { _id, name, description, priority, deliveryDate, state, completed } = task

    return (
        <div className='border-b p-5 flex justify-between items-center'>
            <div className='flex flex-col items-start'>
                <p className='mb-1 text-xl'>Nombre: {name}</p>
                <p className='mb-1 text-sm text-gray-500'>Descripción: {description}</p>
                <p className='mb-1 text-sm text-gray-600'>Fecha de entrega: {formatDate(deliveryDate)}</p>
                <p className='mb-1 text-sm text-gray-700'>Prioridad: {priority}</p>
                {state && (
                    <p className='text-xs bg-green-600 uppercase p-2 rounded-lg text-white'>
                        Completada por: {completed.name}
                    </p>
                )}
            </div>

            <div className='flex flex-col lg:flex-row gap-2'>

                {admin && (
                    <button
                        className='bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'
                        onClick={() => handleModalEditTask(task)}
                    >Editar</button>
                )}

                <button
                    className={`${state ? 'bg-sky-600' : 'bg-gray-600'} px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}
                    onClick={() => completeTask(_id)}
                >{state ? 'Completa' : 'Incompleta'}</button>
                
                {admin && (
                    <button
                        className='bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'
                        onClick={() => handleModalDeleteTask(task)}
                    >Eliminar</button>
                )}
            </div>
        </div>
    )
}

export default Task