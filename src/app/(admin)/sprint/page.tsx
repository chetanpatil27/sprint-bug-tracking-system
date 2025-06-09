import React from 'react'
import SprintForm from './form'

const page = () => {
  return (
    <div>
      <h1>sprint page</h1>
      <SprintForm />
      <div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Sprint 1</td>
              <td>Initial sprint</td>
              <td>Active</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>Sprint 2</td>
              <td>Second sprint</td>
              <td>Completed</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default page