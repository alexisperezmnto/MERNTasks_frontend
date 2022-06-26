import { useEffect } from 'react'
import useProjects from '../hooks/useProjects'
import { useParams } from 'react-router-dom'
import ContributorForm from '../components/ContributorForm'


const NewContributor = () => {

  const params = useParams()

  const { project, loading, contributor, getProject, addContributor } = useProjects()

  useEffect(async () => {
    await getProject(params.id)
  }, [])
  
  return (
    <>
      <h1 className='text-4xl font-black'>Añadir Colaborador(a) al Proyecto: {project.name}</h1>

      <div className='mt-10 flex justify-center'>
        <ContributorForm />
      </div>

      {loading ? <p className='text-center'>Cargango...</p> : contributor?._id && (
        <div className='flex justify-center mt-10'>
          <div className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow w-full'>
            <h2 className='text-center mb-10 text-2x font-bold'>Resultado: </h2>

            <div className='flex justify-between items-center'>
              <p>{contributor.name}</p>

              <button
                type='button'
                className='bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm'
                onClick={() => addContributor({email: contributor.email})}
              >Agregar al Proyecto</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default NewContributor