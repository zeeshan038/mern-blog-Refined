import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import app from '../Firebase';
import { useDispatch } from 'react-redux';
import { signInFailure, signInSuccess } from '../redux/reducers/userReducer';
import { useNavigate } from 'react-router';
const OAuth = () => {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const handleGoogle  = async()=>{
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({prompt : 'select_account'});
        try {
           const resultFromGoogle = await signInWithPopup(auth , provider);
           const res = await fetch('/api/v1/user/google',{
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify({
                name : resultFromGoogle.user.displayName , 
                email  : resultFromGoogle.user.email ,
                googlePhotoUrl : resultFromGoogle.user.photoURL
            })
           })
 
           const data = await res.json();
           if(!res.ok){
              dispatch(signInFailure());
           }
           dispatch(signInSuccess(data));
           navigate('/');
        } catch (error) {
               dispatch(signInFailure());
        }
    }
  
  return (
    <div>
         <button onClick={handleGoogle} className='w-80 bg-orange-600 text-white rounded-lg mt-4 p-3 font-bold
                '>Continue with google</button>
    </div>
  )
}

export default OAuth