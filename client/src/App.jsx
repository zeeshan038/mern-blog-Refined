
import './App.css'
import{BrowserRouter , Route , Routes, useParams} from  "react-router-dom"
import { Suspense, lazy } from 'react'
import { Toaster } from 'react-hot-toast';
import OAuth from './components/OAuth';
import Dashboard from './Pages/Dashboard';
import AdminPrivateroutes from './Pages/AdminPrivateroutes';
import CreatePost from './Pages/CreatePost';
import PostPage from './Pages/PostPage';
import DashPosts from './Pages/DashPosts';
import UpdatePage from './Pages/UpdatePage';
import Search from './Pages/Search';

const Home = lazy(()=>import('./Pages/Home'));
const  Navbar = lazy(()=>import('./components/Navbar'));
const  About = lazy(()=>import('./Pages/About'));
const  Blogs = lazy(()=>import('./Pages/Blogs'));
const  Login  = lazy(()=>import('./Pages/Login'));
const    Register= lazy(()=>import('./Pages/Register'));

function App() {
  const {postSlug} = useParams();
  return (
    <div>
      <BrowserRouter>
      <Suspense fallback={<h1>Loading....</h1>}>
         <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/blogs' element={<Blogs/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/auth' element={<OAuth/>}/>
        <Route path='/post/:postSlug' element={<PostPage/>}/>
        <Route path='/search' element={<Search/>}/>

        {/* <Route element={<ProtectedRoutes/>}>
   
        </Route> */}
    
        <Route element={<AdminPrivateroutes/>}>
        <Route path='/dashboard' element={<Dashboard/>}/>
           <Route path='/createpost' element={<CreatePost/>}/>
           <Route path='/dashpost' element={<DashPosts/>}/>
           <Route path={`/update-post/:postId`} element={<UpdatePage/>}/>
        </Route>

      </Routes>
      </Suspense>
      </BrowserRouter>
      <Toaster/>
    </div>
  )
}

export default App
