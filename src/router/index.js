import { createBrowserRouter } from "react-router-dom"
import App from '../App'
import ErrorPage from '../views/error-page'
import Canvas from '../views/canvas'
import Watermark from "../views/water-mark"

export default createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
       path: 'canvas',
       element: <Canvas />
      },
      {
        path: 'water-mark',
        element: <Watermark />
       }
     ]
  }
])