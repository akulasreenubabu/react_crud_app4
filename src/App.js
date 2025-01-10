import React from "react";
import { useState, useEffect } from "react"; 
import axios from "axios"
import "./App.css"

const App = ()=>{
  const [users, setUsers] = useState([])
  const [newUser, setNewUser] = useState({id:"", course:"", name:""})
  const [searchQuery, setSearchQuery]= useState("")
  const [editUser, setEditUser]= useState(null)
  const [isModalOpen, setIsModalOpen]= useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage]= useState("")

  useEffect(()=>{
    fetchUsers()
  }, [])

  const fetchUsers= async ()=>{
    try {
      //const baseURL = process.env.REACT_APP_API_URL
      const usersData = await axios.get("http://localhost:3001/users")
      console.log("Usersdata:", JSON.stringify(usersData))
      //setUsers(usersData.data)
    //  if(usersData.data)
      setUsers(usersData.data.data)
  } catch (error) {
      console.log("fetchUsers Error:", error)
    }
  }

  const handleEditUser = (id)=>{
   // alert("Button click")
    const userToEdit = users.find((user)=>{
      return user.id===id
    } )
    if(userToEdit){
      setEditUser(userToEdit)
      setIsModalOpen(true)
    }
    else{
      alert('User not found!')
    }
  }

  const handleAddUser = async()=>{
    const newId=users.length>0? Math.max(...users.map(user=>user.id))+1 : 1
    if(newUser.name && newUser.course){
      const response = await axios.post("http://localhost:3001/users", [{...newUser, id:newId}])
      if(response.data.status==="Success"){
        fetchUsers()
        setNewUser({id:"", name:"", course:""})
        setSuccessMessage(response.data.message)
        setIsModalOpen(false)
        }
      else{
        fetchUsers()
        setNewUser({id:"", name:"", course:""})
        setErrorMessage(response.data.message)
        setIsModalOpen(false)
      }
      setTimeout(()=>{
        setSuccessMessage("")
        setErrorMessage("")
      },6000)
    }
  }

  const handleDeleteUser= async(id)=>{
    try{
      const response= await axios.delete(`http://localhost:3001/user/${id}`)
      if(response.data.status==="Success"){
        await fetchUsers()
        setSuccessMessage(response.data.message)
      }
      else{
        console.log("Response data", JSON.stringify(response.data))
        await fetchUsers()
        setErrorMessage(response.data.message)
      }
      setTimeout(()=>{
        setSuccessMessage("")
        setErrorMessage("")
      }, 6000)
      //throw new Error("error occured")
    }
    catch(error){
      console.log("HandleDeleteerror:", error)
      await fetchUsers()
      setErrorMessage(error)
    }
  }

  const handleSaveEdit = async()=>{
    if(editUser&&editUser.name&&editUser.course){
      try {
        const response= await axios.put(`http://localhost:3001/user/${editUser.id}`, {
          name: editUser.name, 
          course: editUser.course
        })
        if(response.data.status === "Success"){
          fetchUsers()
          setIsModalOpen(false)
          setEditUser(null)
          console.log(successMessage,response.data.message)
          setSuccessMessage(response.data.message)
        }else{
          fetchUsers()
          setIsModalOpen(false)
          setEditUser(null)
          setErrorMessage(response.data.message)
          console.log("Error while updating the user data", JSON.stringify(response.data))
        }
        setTimeout(()=>{
          setSuccessMessage("")
          setErrorMessage("")
        }, 6000)
      }catch(error){
        console.log("handleSaveEdit error", error)
      }
    }else{
      alert("Please fill out all required fields")
    }
  }


  const filterUsers=users?
  users.filter((user)=>{
    return user.name.toLowerCase().includes(searchQuery.toLowerCase())||
    user.course.toLowerCase().includes(searchQuery.toLowerCase())||
    user.id.toString().includes(searchQuery)
  }):
  []

  return (<div className="app-container">
    <header className="app-header"> 
      <h1> 
        Team Members:
      </h1>
      <div className="add-user-container">
      <input type="text" 
      placeholder="Search by ID, Name or Course" 
      value={searchQuery}
      onChange={(e)=>{
        return setSearchQuery(e.target.value)
      }}
      className="search-bar"></input>
      <button onClick={()=>{
        setEditUser(null)
        setIsModalOpen(true)
      }}>Add New Member</button>
      </div>
    </header>
    {successMessage&&(
      <div className="success-message">
        <span>{successMessage}</span>
        <button onClick={()=>{
          setSuccessMessage(" ")
        }} style={{background:"none", border:"none", cursor:"pointer"}} > ✖</button>
      </div>
    )}
    {errorMessage&&(
      <div className="error-message">
        <span>{errorMessage}</span>
        <button onClick={()=>{
          setErrorMessage(" ")
        }} style={{background:"none", border:"none", cursor:"pointer"}} > ✖</button>
      </div>
    )}
    <table className="users-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Course</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {
          filterUsers.map((user)=>{
            return (<tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.course}</td>
              <td>
                <button onClick={()=>{
                  return handleEditUser(user.id)
                }} style={{
                  background: "none", border: "none"
                }}>
                ✏️
                </button>

                <button onClick={()=>{
                  return handleDeleteUser(user.id)
                }} style={{
                  background: "none", border: "none"
                }}>
                🗑️
                </button>
               
              </td>
            </tr>)
          })
        }
      </tbody>
    </table>
    {
      isModalOpen && (
        <div className="modal">
          <div className="modal-content"> 
            <button className="close-icon" onClick={()=>{
              setIsModalOpen(false)
              setEditUser(null)
            }}>
              ✖
            </button>
            <h2>Edit Member</h2>
                <label>Name*</label>
                <input type="text"
                value={editUser.name}
                onChange={(e)=>{
                  return setEditUser({name: e.target.value, course: editUser.course, id: editUser.id})
                }}></input>
                 <label>Course*</label>
                 <input type="text" 
                 value={editUser.course}
                onChange={(e)=>{
                  return setEditUser({name: editUser.name, course: e.target.value, id: editUser.id})
                }}></input>
                <button onClick={handleSaveEdit}>Save</button>
          </div>

        </div>
      )
    }
  </div>)
}

//module.exports = {App}
export default App