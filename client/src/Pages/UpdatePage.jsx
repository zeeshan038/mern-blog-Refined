import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref,  uploadBytesResumable } from 'firebase/storage';
import app from '../Firebase';
import { useNavigate, useParams } from 'react-router';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { useSelector } from 'react-redux';

const UpdatePage= () => {
 const [formData , setFormData] = useState({title:"" , content : " " , image : "" , category:""});
const[file , setFile] = useState(null);
const[ImageError , setImageError] = useState(null);
const[imageUploadProgress , setImageUploadProgress] = useState(null);
const [formErrorr , setFormError] = useState(null);
const [publishError , setpublishError] = useState(null);
const {currentUser} = useSelector((state)=>state.user);
const navigate = useNavigate();
const {postId} = useParams();
console.log(formData)

useEffect(()=>{
  const fetchPost = async()=>{
    const res = await fetch(`/api/v1/post/getposts?postId=${postId}`);
    const data = await res.json();
    if(res.ok){
        setFormData(data.post[0]);
    }
  }
  fetchPost();
},[postId])
 
const handleImage = ()=>{
  if(!file){
    setImageError("Please Provide an imaage first");
    return;
  }
     const storage = getStorage(app);
     const filename = new Date().getTime() + file.name;
     const storageRef = ref(storage , filename);
     const uploadTask = uploadBytesResumable(storageRef , file);
     uploadTask.on(
      'state_changed' , 
     (snapshot)=>{
      const progress= (snapshot.bytesTransferred/ snapshot.totalBytes) * 100;
          setImageUploadProgress(progress);
     },
     (error)=>{
         setImageError("Image upload failed");
         setImageUploadProgress(null);
     },
     ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
            setImageUploadProgress(null);
            setFormData({...formData , image : downloadURL});
          })
     }
     )
 
}

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      const res = await fetch(`/api/v1/post/update/${formData._id}/${currentUser._id}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(!res.ok){
        setFormError(data.message);
      }else{
        if(data.slug){
           navigate(`/postpage/${data.slug}`)
        }else{
          setFormError("No slug found")
        }
      }
    } catch (error) {
        next(error)
    }
  }
  

  return (
    <div className='p-3 mx-auto min-h-screen w-1/2'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Update Post</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <input
            type="text"
            placeholder='Title'
            id='title'
            name='title'
            value={formData.title}
            onChange={(e)=>setFormData({...formData ,title : e.target.value })}
         
            required
            className='w-[170%] border-2 h-10 rounded-md'
          />
          <select
            name="category"
            id='category'
            className='w-[30%] h-10 rounded-md border-4 border-teal-100'
            value={formData.category}
            onChange={(e)=>setFormData({...formData ,category : e.target.value })}
          >
            <option value="">Select a Category</option>
            <option value="React">React</option>
            {/* Add options dynamically or statically here */}
          </select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-400 border-dotted p-3'>
          <input  type="file" accept='image/*' onChange={(e)=>setFile(e.target.files[0])} />
          <button type='button' className='border-2 border-black rounded-md font-semibold cursor-pointer' onClick={handleImage} >Upload Image</button>
        </div>
        {
          imageUploadProgress !==null && (
            <div className='w-16 h-16'>
              <CircularProgressbar value={imageUploadProgress} text={`${Math.round(imageUploadProgress)}%`} className='W-12' />
            </div>
          )
        }
        {
          formData.image && (
            <img src={formData.image} alt='cover' className='w-full h-72 object-cover' />
          )
        }
        <ReactQuill theme="snow" className='h-96  mb-12' required value={formData.content} onChange={(value)=>setFormData({...formData , content : value})}
          />
        <button type='submit' className='text-white py-2 border-2 rounded-lg mt-1 w-[100%] bg-orange-400 hover:bg-gray-500 transition ease-in-out delay-100'>
         Update
        </button>
      </form>
      {ImageError && <div className='text-red-600'>{ImageError}</div>}
      {formErrorr && <div className='text-red-600'>{formErrorr}</div>}
      {publishError && <div className='text-red-600'>{publishError}</div>}
    </div>
  )
}

export default UpdatePage;
