import useProjects from '../hooks/useProjects'

const Contributor = ({contributor}) => {

    const { handleModalDeleteContributor } = useProjects()

    const { _id, name, email } = contributor

    return (
        <div className='border-b p-5 flex justify-between items-center'>
            <div>
                <p className='mb-1 text-xl'>Nombre: {name}</p>
                <p className='mb-1 text-sm text-gray-500'>Email: {email}</p>
            </div>

            <div className='flex gap-2'>
                <button
                    className='bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'
                    onClick={() => handleModalDeleteContributor(contributor)}
                >Eliminar</button>
            </div>
        </div>
    )
}

export default Contributor