
import React from 'react'
import './App.css'
import { Button } from './components/ui/button'
import { Toaster } from './components/ui/sonner'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Pages/Home'
import Name from './Pages/Name'
import EachPoll from './Pages/EachPoll'
import Body from './Pages/Body'

function App() {

const appRouter=createBrowserRouter([
  {
    path:'/',
    element:<Body/>,
    children:[
      {
        path:'/',
        element:<Home/>
      },
      {
        path:'/name',
        element:<Name/>
      },
      {
        path:'/poll/:id',
        element:<EachPoll/>
      }

    ]
  },
 
])
  return (
   <main>
    <Toaster position="bottom-center"/>
    <RouterProvider router={appRouter}/>
   </main>
  )
}

export default App
