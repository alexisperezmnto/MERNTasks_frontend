import { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../config/axiosClient'
import useAuth from '../hooks/useAuth'
import io from 'socket.io-client'

let socket

const ProjectsContext = createContext()

const ProjectsProvider = ({children}) => {

    const [projects, setProjects] = useState([])
    const [project, setProject] = useState({})
    const [alert, setAlert] = useState({})
    const [loading, setLoading] = useState(false)
    const [modalTaskForm, setModalTaskForm] = useState(false)
    const [task, setTask] = useState({})
    const [modalDeleteTask, setModalDeleteTask] = useState(false)
    const [contributor, setContributor] = useState({})
    const [modalDeleteContributor, setModalDeleteContributor] = useState(false)
    const [searcher, setSearcher] = useState(false)

    const navigate = useNavigate()

    const { auth } = useAuth()

    useEffect(() => {
        const getProjects = async () => {
            try {
                const token = localStorage.getItem('token')
                if(!token) return
    
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const { data } = await axiosClient('/projects', config)
                setProjects(data)
            } catch (error) {
                console.log(error)
            }
        }

        getProjects()
    }, [auth])
    
    //Socket io
    useEffect(() => {
        socket = io(process.env.REACT_APP_BACKEND_URL)
    }, [])

    const showAlert = alert => {
        setAlert(alert)
        setTimeout(() => {
            setAlert({})
        }, 2000);
    }

    const submitProject = async project => {
        try {

            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            
            if(project.id) {
                //Edit Project
                const {data} = await axiosClient.put(`/projects/${project.id}`, project, config)
                const updatedProjects = projects.map(project => project._id === data._id ? data : project)
                setProjects(updatedProjects)
            } else {
                //New Project
                const {data} = await axiosClient.post('/projects', project, config)
                setProjects([
                    ...projects,
                    data
                ])
            }
            
            showAlert({
                msg: project.id ? 'Proyecto actualizado correctamente' : 'Proyecto creado correctamente',
                error: false
            })

            navigate('/projects')
        } catch (error) {
            console.log(error)
        }
    }

    const getProject = async id => {
        setLoading(true)

        const token = localStorage.getItem('token')
        if(!token) return

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        
        try {
            const {data} = await axiosClient(`/projects/${id}`, config)
            setProject(data)
        } catch (error) {
            console.log(error.response.data.msg)
            navigate('/projects')
        }

        setLoading(false)
    }

    const deleteProject = async id => {

        const token = localStorage.getItem('token')
        if(!token) return

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        
        try {
            const {data} = await axiosClient.delete(`/projects/${id}`, config)
            const updatedProjects = projects.filter(project => project._id !== id)
            setProjects(updatedProjects)
            navigate('/projects')
        } catch (error) {
            console.log(error)
        }
    }

    const handleModalTask = () => {
        setModalTaskForm(!modalTaskForm)
        setTask({})
    }

    const submitTask = async task =>  {
        
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            if(task.id) {
                //Edit Task
                const {data} = await axiosClient.put(`/tasks/${task.id}`, task, config)

                //Socket io
                socket.emit('edited task', data)
            } else {
                //New Task
                const {data} = await axiosClient.post('/tasks', task, config)
                
                //Socket io
                socket.emit('new task', data)
            }
            
            showAlert({
                msg: task.id ? 'Tarea actualizada correctamente' : 'Tarea creada correctamente',
                error: false
            })

            setModalTaskForm(false)
            setTask({})

        } catch (error) {
            console.log(error)
        }
    }

    const handleModalEditTask = task => {
        setTask(task)
        setModalTaskForm(true)
    }

    const handleModalDeleteTask = task => {
        setTask(task)
        setModalDeleteTask(!modalDeleteTask)
    }

    const deleteTask = async () => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await axiosClient.delete(`/tasks/${task._id}`, config)

            showAlert({
                msg: data.msg,
                error: false
            })

            setModalDeleteTask(false)
            
            //Socket io
            socket.emit('delete task', task)
            
            setTask({})
        } catch(error) {
            console.log(error)
        }
    }

    const submitContributor = async email => {
        setLoading(true)

        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await axiosClient.post('/projects/contributors', email, config)

            setContributor(data)
            setAlert({})
        } catch (error) {
            showAlert({
                msg: error.response.data.msg,
                error: true
            })
            setContributor({})
        }

        setLoading(false)
    }

    const addContributor = async email => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await axiosClient.post(`/projects/contributors/${project._id}`, email, config)

            showAlert({
                msg: data.msg,
                error: false
            })

            setContributor({})
        } catch (error) {
            showAlert({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const handleModalDeleteContributor = contributor => {
        setModalDeleteContributor(!modalDeleteContributor)
        setContributor(contributor)
    }
    
    const deleteContributor = async () => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await axiosClient.post(`/projects/delete-contributor/${project._id}`, {id: contributor._id}, config)

            showAlert({
                msg: data.msg,
                error: false
            })

            //Update State
            const updatedProject = {...project}
            updatedProject.contributors = updatedProject.contributors.filter(projectContributor => projectContributor._id !== contributor._id)
            setProject(updatedProject)

            setContributor({})
            setModalDeleteContributor(false)
            
        } catch(error) {
            console.log(error)
        }
    }

    const completeTask = async id => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const {data} = await axiosClient.post(`/tasks/state/${id}`, {}, config)
            
            //Socket io
            socket.emit('state task', data)

            setTask({})
            setAlert({})
            
        } catch(error) {
            console.log(error)
        }
    }

    const handleSearcher = () => {
        setSearcher(!searcher)
    }


    //Close session
    const closeSessionProjects = () => {
        setProjects([])
        setProject({}) 
    }


    //Socket io
    const submitProjectTasks = task => {
        //Update State
        const updatedProject = { ...project }
        updatedProject.tasks = [ ...updatedProject.tasks, task ]
        setProject(updatedProject)
    }

    const updateProjectTasks = task => {
        //Update State
        const updatedProject = { ...project }
        updatedProject.tasks = updatedProject.tasks.map(updateTask => updateTask._id === task._id ? task : updateTask)
        setProject(updatedProject)
    }

    const deleteProjectTasks = task => {
        //Update State
        const updatedProject = {...project}
        updatedProject.tasks = updatedProject.tasks.filter(projectTask => projectTask._id !== task._id)
        setProject(updatedProject)
    }

    const changeStateProjectTask = task => {
        //Update State
        const updatedProject = {...project}
        updatedProject.tasks = updatedProject.tasks.map(projectTask => projectTask._id === task._id ? task : projectTask)
        setProject(updatedProject)
    }

    return (
        <ProjectsContext.Provider
            value={{
                projects,
                project,
                loading,
                alert,
                modalTaskForm,
                task,
                modalDeleteTask,
                contributor,
                modalDeleteContributor,
                searcher,
                setProjects,
                submitProject,
                getProject,
                deleteProject,
                showAlert,
                handleModalTask,
                submitTask,
                handleModalEditTask,
                handleModalDeleteTask,
                deleteTask,
                submitContributor,
                addContributor,
                handleModalDeleteContributor,
                deleteContributor,
                completeTask,
                handleSearcher,
                submitProjectTasks,
                deleteProjectTasks,
                updateProjectTasks,
                changeStateProjectTask,
                closeSessionProjects
            }}
        >
            {children}
        </ProjectsContext.Provider>
    )
}

export {
    ProjectsProvider 
}

export default ProjectsContext