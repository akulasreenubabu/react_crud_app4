import React from "react";
import { useState, useEffect } from "react"; 
import axios from "axios"
import "./App.css"

const App = ()=>{
  const [users, setUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [editUser, setEditUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(()=>{
    fetchUsers()
  }, [])

  const fetchUsers= async ()=>{
    try {
      const usersData = await axios.get("http://localhost:3001/users")
      console.log("Usersdata:", JSON.stringify(usersData))
    //  if(usersData.data)
      setUsers(usersData.data.data)
    } catch (error) {
      console.log("fetchUsers Error:", error)
    }
  }

  const handleEditUser = (id)=>{
    const userToEdit = users.find((user) => {
      return user.id===id
    })
    if(userToEdit){
      setEditUser(userToEdit)
      setIsModalOpen(true)
    }
    else {
      alert("User not found")
    }
  }
  const handleSaveEdit=async()=>{
    if(editUser&&editUser.name&&editUser.course){
      try {
        const response=await axios.put(`http://localhost:3001/user/${editUser.id}`,{
          name: editUser.name,
          course: editUser.course
        })
        if(response.data.status==="Success"){
          fetchUsers()
          setIsModalOpen(false)
          setEditUser(null)
        }else{
          console.log("error while updating user data", JSON.parse(response))
        }

      }catch(error){
        console.log("handleSaveEdit error,", error)
      }

    }else{
      alert("Please fill out all required fields")
    }
  }

  return (<div className="app-container">
    <header className="app-header"> 
      <h1> 
        Team Members
      </h1>
      <div className="add-user-container">
         <input type="text" 
         placeholder="Search by ID, Name or Course" 
         value={searchQuery}
         onChange={(e)=>{
          return setSearchQuery(e.target.value)
         
        }}
        className="search-bar" ></input> 
      </div>
    </header>
    <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Course</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            users.map((user)=>{
             return (<tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.course}</td>
                <td>
                  <button onClick={()=>{
                    return handleEditUser(user.id)
                  }} style={{background:"none",border:"none"}}>
                  ✏️
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
            <button className="close-icon" onClick={() => {
              setIsModalOpen(false)
              setEditUser(null)
            }}>
               ✖
            </button>
            <h2>Edit user</h2>
            <label>Name*</label>
            <input type="text"
            value={editUser.name}
            onChange={(e)=>{
              return setEditUser({name: e.target.value,course: editUser.course,id:editUser.id})
            }}></input>
            <label>Course*</label>
            <input type="text"
            value={editUser.course}
            onChange={(e)=>{
              return setEditUser({name: editUser.name, course:e.target.value, id:editUser.id})
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