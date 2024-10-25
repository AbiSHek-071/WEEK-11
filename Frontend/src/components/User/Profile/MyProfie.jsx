import axiosInstance from '@/AxiosConfig';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addUser } from "@/store/slice/userSlice";
import { toast } from 'sonner';
import Address from './Address';
function MyProfie() {
    //redux
    const userData = useSelector((store) => store.user.userDatas);
    const dispatch = useDispatch();

    //states..
    const [isEditing, setIsEditing] = useState(false);
    const [name,setName] = useState(userData.name);
    const [phone,setPhone] = useState(userData.phone)

    //FUNCTIONS
    async function handleUpdate() {
        console.log(name);
            console.log(phone);
        try {
            const response = await axiosInstance.post("/user/edit", { userId:userData._id,name,phone });
            dispatch(addUser(response.data.update));
            setIsEditing(false)
            toast.success(response.data.message);
        } catch (err) {
            if(err.response){
                return toast.error(err.response.data.message); 
            }
        }
    }
  
    

    // useEffect(()=>{

    // })

  return (
    <div className='p-8 '>
      <div className='flex flex-col justify-between gap-3'>
        <h1 className='text-3xl font-bold'>My Profile</h1>
        <p className='text-gray-500'>Profile &gt; MyProfile</p>
      </div>
      <div className='flex justify-start items-start h-full w-ful'>
        <div className='bg-white border mt-12 border-gray-200 rounded-lg shadow-md p-10 w-full max-w-4xl'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4 md:mb-0'>
              Details
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className='text-gray-600 hover:text-black transition-colors border-b border-gray-300 hover:border-black'>
                Edit Profile
              </button>
            )}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Name
              </label>
              {isEditing ? (
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500'
                />
              ) : (
                <p className='text-lg text-gray-900'>{userData.name}</p>
              )}
            </div>
            <div>
              <label
                htmlFor='phone'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Phone
              </label>
              {isEditing ? (
                <input
                  type='tel'
                  id='phone'
                  name='phone'
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500'
                />
              ) : (
                <p className='text-lg text-gray-900'>{userData.phone}</p>
              )}
            </div>

            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Email
              </label>
              {isEditing ? (
                <>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={userData.email}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500'
                  />
                  <span className='ms-2 text-red-500'>
                    You can not edit E-mail
                  </span>
                </>
              ) : (
                <p className='text-lg text-gray-900'>{userData.email}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className='mt-6 flex justify-end'>
              <button
                onClick={handleUpdate}
                className='px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors'>
                Update Profile
              </button>
            </div>
          )}

          <div className='mt-8 flex justify-between border-t pt-4'>
            <Link
              to={"/user/profile/orders"}
              className='text-gray-600 hover:text-black transition-colors border-b border-gray-300 hover:border-black'>
              Order Details
            </Link>
            <Link
              to={"/user/profile/wallet"}
              className='text-gray-600 hover:text-black transition-colors border-b border-gray-300 hover:border-black'>
              My Wallet
            </Link>
          </div>
        </div>
      </div>
        <Address/>
    </div>
  );
}

export default MyProfie