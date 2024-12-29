import React from "react";
import { useState, useEffect } from "react"; 
import axios from "axios"
import "./App.css"

const App = ()=>{
  const [users, setUsers] = useState([])

  useEffect(()=>{
    fetchUsers()
  }, [])

  const fetchUsers= async ()=>{
    try {
      const usersData = await axios.get("http://localhost:3001/users")
      console.log("Usersdata:", JSON.stringify(usersData))
    //  if(usersData.data)
    } catch (error) {
      console.log("fetchUsers Error:", error)
    }
  }

  return (<div>
    <header> 
      <h1> 
        users:
      </h1>
    </header>
  </div>)
}

//module.exports = {App}
export default App