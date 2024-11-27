import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"
import ConfirmationModal from '@/components/shared/confirmationModal'
import axiosInstance from '@/AxiosConfig'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '@/store/slice/userSlice'

export default function ChangePassword() {

  const userData = useSelector((store)=>store.user.userDatas);
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault()
    setModalContent({
        title: "Change Password",
        message: "Are you sure you want to Change to this new password?",
        onConfirm: async () => {
         try {
            console.log(userData);
            
            const _id = userData._id
            const response =await axiosInstance.post("/user/change-password",{currentPassword,newPassword,confirmPassword,_id});
            toast.success(response.data.message);
            dispatch(logoutUser());
            navigate("/login")
         } catch (err) {
            console.log(err);
            if(err.response){
                toast.error(err.response.data.message)
            }
         }
          
        },
      });
      setIsOpen(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={modalContent.title}
        message={modalContent.message}
        onConfirm={modalContent.onConfirm}
      />
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Change Password
          </h2>
        </div>
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Attention needed
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Changing your password will log you out of all devices. You'll need to log in again with your new password.
                </p>
              </div>
            </div>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="current-password" className="sr-only">
                Current Password
              </label>
              <Input
                id="current-password"
                name="current-password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="new-password" className="sr-only">
                New Password
              </label>
              <Input
                id="new-password"
                name="new-password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm New Password
              </label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button
            //   type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}