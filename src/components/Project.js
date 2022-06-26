import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Project = ({project}) => {
    
    const {auth} = useAuth()

    const { _id, name, customer, createdBy } = project
        
    return (
        <div className='border-b p-5 flex flex-col md:flex-row justify-between'>
            <div className='flex items-center gap2'>
                <p className='flex-1'>
                    {name}

                    <span className="ml-2 text-sm text-gray-500 uppercase">
                        {customer}
                    </span>
                </p>

                {auth._id !== createdBy && (
                    <p className='ml-2 p-2 text-xs rounded-lg text-white bg-green-500 font-bold uppercase'>Colaborador</p>
                )}
            </div>

            <Link 
                to={`${_id}`}
                className='text-gray-600 hover:text-gray-800 uppercase text-sm font-bold'
            >
                Ver Proyecto
            </Link>
        </div>
    )
}

export default Project