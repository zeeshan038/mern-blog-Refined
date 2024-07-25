import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { signInFailure, signInStart, signInSuccess } from '../redux/reducers/userReducer';

const Login = () => {
    const [formData , setFormData] = useState({});
    const [error , setError] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const handleChange = (e)=>{
        setFormData({...formData , [e.target.id] : e.target.value })
    }
  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(!formData.email || !formData.password){
        setError("Fill all Fields ")
    }
    try {
         dispatch(signInStart());
         const res = await fetch('/api/v1/user/login', {
            method: "POST" , 
            headers : {"Content-Type" : "application/json"} , 
            body : JSON.stringify(formData),
         });
          const data = await res.json();
         if(!res.ok){
           dispatch(signInFailure(data.message))
         }
         else{
            dispatch(signInSuccess(data))
            navigate('/')
            toast.success("User Loggedin successfully")
         }

    } catch (error) {
        console.log(error)
    }
  }
  return (
    <div>
          <div className='flex flex-col justify-center items-center mt-12  mx-auto'>
            <h1 className='font-bold text-3xl'>Login</h1>
            <form className='mt-12 flex flex-col justify-center items-center' onSubmit={handleSubmit}>
                <input type="email" id='email' placeholder='admin@gmail.com'  className='border-2 border-black
                rounded-lg w-80 md:w-full p-2' onChange={handleChange} />
                <input type="password" id='password' placeholder='1' className='border-2 border-black
                rounded-lg w-80 md:w-full p-2 mt-6 ' onChange={handleChange}/>
                <button className='w-80 bg-orange-400 rounded-lg mt-4 p-3 font-bold
                '>Login</button>
            </form>
          
              <div className='flex justify-end items-center ml-40 mt-1 gap-1'>
                <p className='font-thin'>  Not user ?</p>
                <span className='font-semibold text-orange-500 underline'><Link to={'/register'}>Register</Link></span>
              </div>
              {
                error && (
                    <p className='text-red-600 '>{error}</p>
                )
              }
            
          </div>
    </div>
  )
}

export default Login