import React, { useState, useEffect } from "react"
import axios from "axios"
import './App.css';

function App() {

  const [state, setState] = useState({
    title: ""
  })
  const [updated, setUpdated] = useState("")
  const [isEdit, setIsEdit] = useState(false)
  const [editId, setEditId] = useState()
  const [documents, setDocuments] = useState([])
  const URL = process.env.REACT_APP_url;
  console.log(URL);

  const handleChange = e => {
    setUpdated(e.target.value)
    setState(s => ({ ...s, "title": e.target.value }))
    // console.log(state);
  }

  const handleSubmit = (doc) => {
    doc.preventDefault();

    if (!isEdit) {
      let formData = { ...state }
      // console.log(formData)

      axios.post(`${URL}/createTodo`, formData)
        .then((res) => {
          console.log("A new Todo has been successfully added.")
        })
        .catch(err => {
          console.error(err)
        })
    }
    else if (isEdit) {
      // let newData = { ...state }
      let newData = { id: editId, title: updated }
      // const { _id } = editId
      console.log(newData)

      // axios.put(`${URL}/updateTodo/${_id}`, newData)
      //   .then((res) => {
      //     console.log("message from server", res.data)
      //     alert("Todo has been successfully updated.")
      //   })
      //   .catch((err) => {
      //     console.error('getting error in app.js')
      //   })

      axios.put(`${URL}/updateTodo`, newData)
        .then((res) => {
          console.log("message from server", res.data)
          alert("User has been successfully updated.")
        })
        .catch((err) => {
          console.error(err.message)
        })

      setIsEdit(false)
    }
    else {
      alert("nothing")
    }

    // console.log(formData)
  }

  useEffect(() => {
    axios.get(`${URL}/getTodos`)
      .then((res) => {
        // console.log(res.data)
        setDocuments(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  const handleUpdate = doc => {
    setIsEdit(true)
    console.log(doc)
    setEditId(doc._id)
    setUpdated(doc.title)
    setState(s => ({ ...s, "title": updated }))
  }
  const handleDelete = doc => {
    console.log(doc)

    const { _id } = doc

    axios.delete(`${URL}/deleteTodo/${_id}`)
      .then((res) => {
        console.log("Todo deleted")
        console.log("message from server", res.data)
        // setDocuments(res.data)
      }).catch((err) => {
        console.error(err)
      }).finally(() => {
        // console.log("finally worked")
      })
  }

  return (
    <div>
      <h1>Todo List</h1>

      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Title" onChange={(e) => handleChange(e)} value={updated} />
        <button>{isEdit === true ? 'Edit Todo' : 'Add Todo'}</button>
      </form>
      <h1>All Todos</h1>
      {documents.map((doc, i) => {
        return <div key={i} className="todo">
          <p><b>Id</b>: {doc._id}</p>
          <p className="title"><b>Title</b>: <span style={{ color: 'yellow' }}>{doc.title}</span></p>
          <div className="btn">
            <button onClick={() => { handleUpdate(doc) }}>Update</button><button onClick={() => { handleDelete(doc) }}>Delete</button>
          </div>
        </div>
      })}
    </div>
  );
}

export default App;
