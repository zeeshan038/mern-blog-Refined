import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { signInFailure, signInStart, signInSuccess } from '../redux/reducers/userReducer';
import OAuth from '../components/OAuth';

const Register = () => {
    const [formData , setFormData] = useState({});
    const [error , setError] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleChange = (e)=>{
        setFormData({...formData , [e.target.id] : e.target.value })
    }
  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(!formData.username ||!formData.email  || !formData.password){
        setError("Fill all Fields ")
    }
    try {
        dispatch(signInStart());
         const res = await fetch('/api/v1/user/register', {
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
            navigate('/login')
            toast.success("User Registered successfully")
         }

    } catch (error) {
        console.log(error)
    }
  }
  return (
    <div>
          <div className='flex flex-col justify-center items-center mt-12  mx-auto'>
            <h1 className='font-bold text-3xl'>Register</h1>
            <form className='mt-12 flex flex-col justify-center items-center' onSubmit={handleSubmit}>
            <input type="text" id='username' placeholder='Username'  className='border-2 border-black
                rounded-lg w-80 md:w-full p-2' onChange={handleChange} />
                <input type="email" id='email' placeholder='Email..'  className='border-2 border-black mt-4
                rounded-lg w-80 md:w-full p-2' onChange={handleChange} />
                <input type="password" id='password' placeholder='Password' className='border-2 border-black
                rounded-lg w-80 md:w-full p-2 mt-6 ' onChange={handleChange}/>
                <button className='w-80 bg-orange-400 rounded-lg mt-4 p-3 font-bold
                '>Register</button>
                <OAuth/>
            </form>
               
              <div className='flex justify-end items-center ml-28 mt-1 gap-1'>
                <p className='font-thin'>  Already an account ?</p>
                <span className='font-semibold text-orange-500 underline'><Link to={'/login'}>Login</Link></span>
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

export default Register;