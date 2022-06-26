import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import useProjects from '../hooks/useProjects'
import useAdmin from '../hooks/useAdmin'
import ModalTaskForm from '../components/ModalTaskForm'
import ModalDeleteTask from '../components/ModalDeleteTask'
import Task from '../components/Task'
import Contributor from '../components/Contributor'
import ModalDeleteContributor from '../components/ModalDeleteContributor'
import Alert from '../components/Alert'
import io from 'socket.io-client'

let socket

const Project = () => {

    const params = useParams()
    
    //Context
    const {project, loading, getProject, handleModalTask, alert, submitProjectTasks, deleteProjectTasks, updateProjectTasks, changeStateProjectTask} = useProjects()
    const admin = useAdmin()
    
    useEffect(() => {
        getProject(params.id)
    }, [])

    //Socket io
    useEffect(() => {
        socket = io(process.env.REACT_APP_BACKEND_URL)
        socket.emit('Open project', params.id)

        //Cleanup function
        return () => {
            socket.off('Open project')
        }
    }, [])

    useEffect(() => {
        socket.on('added task', task => {
            if(task.project === project._id) {
                submitProjectTasks(task)
            }
        })

        socket.on('deleted task', task => {
            const taskProject = task.project._id ? task.project._id : task.project
            if(taskProject === project._id) {
                deleteProjectTasks(task)
            }
        })

        socket.on('updated task', task => {
            if(task.project._id === project._id) {
                updateProjectTasks(task)
            }
        })

        socket.on('task state', task => {
            if(task.project._id === project._id) {
                changeStateProjectTask(task)
            }
        })

        //Cleanup function
        return () => {
            socket.off('added task')
            socket.off('deleted task')
            socket.off('updated task')
            socket.off('task state')
        }
    })
    
    const {name} = project;

    const {msg} = alert

    if(loading) return 'cargando...'

    return (
        <>
            <div className='flex justify-between'>
                <h1 className='font-black text-4xl'>{name}</h1>

                {msg && <Alert alert={alert} />}

                {admin && (
                    <div className='flex items-center gap-2 text-gray-400 hover:text-black cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>

                        <Link
                            to={`/projects/edit/${params.id}`}
                            className='uppercase font-bold'
                        >
                            Editar
                        </Link>
                    </div>
                )}
            </div>
            
            {admin && (
                <button
                    onClick={handleModalTask}
                    type='button'
                    className='flex gap-2 text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-cener mt-5 items-center justify-center'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>

                    Nueva Tarea
                </button>
            )}

            <p className='font-bold text-xl mt-10'>Tareas del Proyecto</p>

            <div className='bg-white shadow mt-10 rounded-lg'>
                {project.tasks?.length ? (
                    project.tasks?.map(task => (
                        <Task 
                            key={task._id}
                            task={task}
                        />
                    ))
                ) : (
                    <p className='text-center my-5 p-10'>No hay tareas en este proyecto</p>
                )}
            </div>
            
            {admin && (    
                <>    
                    <div className='flex items-center justify-between mt-10'>
                        <p className='font-bold text-xl'>Colaboradores</p>
                        <Link
                            to={`/projects/new-contributor/${project._id}`}
                            className='text-gray-400 hover:text-black uppercase font-bold'
                        >
                            Añadir
                        </Link>
                    </div>
                    
                    <div className='bg-white shadow mt-10 rounded-lg'>
                        {project.contributors?.length ? (
                            project.contributors?.map(contributor => (
                                <Contributor 
                                    key={contributor._id}
                                    contributor={contributor}
                                />
                            ))
                        ) : (
                            <p className='text-center my-5 p-10'>No hay colaboradores en este proyecto</p>
                        )}
                    </div>
                </>
            )}

            <ModalTaskForm />
            <ModalDeleteTask />
            <ModalDeleteContributor />
        </>
    )
}

export default Project