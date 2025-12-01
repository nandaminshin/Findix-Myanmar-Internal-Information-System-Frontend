import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from "../pages/Login/Login.tsx";
import DevHome from "../pages/DevHome/DevHome.tsx";
import App from "../App.tsx"

const index = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <App />
            ),
            children: [
                {
                    path: '/',
                    element: <DevHome />
                },
                {
                    path: '/login',
                    element: <Login />
                },
                // {
                //     path: "/dev/home",
                //     element: <DevHome />
                // }
            ]
        }
    ])

    return <RouterProvider router={router} />;
}

export default index;