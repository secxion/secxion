import React, {useContext, useState} from 'react'
import loginicons from './pfpik.gif'
import { Link, useNavigate } from 'react-router-dom';
import { RiEyeCloseLine } from "react-icons/ri";
import { RiEyeCloseFill } from "react-icons/ri";
import SummaryApi from '../common';
import { toast } from 'react-toastify'
import Context from '../Context';


const Login = () => {
  const [showPassword,setShowPassword] = useState(false)
  const [data,setData] = useState({
    email : "",
    password : ""
})
const navigate = useNavigate()
const { fetchUserDetails, fetchUserAddToCart } = useContext(Context)


const handleOnChange = (e) =>{
  const { name , value } = e.target


setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const handleSubmit = async(e) =>{
      e.preventDefault()

      const dataResponse = await fetch(SummaryApi.signIn.url,{
        method : SummaryApi.signIn.method,
        credentials : "include",
        headers : {
          "content-type" : "application/json"
        },
        body : JSON.stringify(data)
      })

      const dataApi = await dataResponse.json()

      if(dataApi.success){
        toast.success(dataApi.message)        
        navigate('/section')
        fetchUserDetails()
        fetchUserAddToCart()
      }

      if(dataApi.error){
        toast.error(dataApi.message)
      }
      
    }
           
  return (
<section id='login'>
        <div className='mx-auto container p-4'>

            <div className='bg-white p-5 w-full max-w-sm mx-auto'>
                    <div className='outline-dotted outline-purple-950 w-20 h-15 mx-auto overflow-hidden rounded-full'>
                        <img src={loginicons} alt='login icons'/>
                    </div>

                    <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
                        <div className='grid'>
                            <label>Email : </label>
                            <div className='bg-slate-100 p-2'>
                                <input 
                                    type='email' 
                                    placeholder='enter your email' 
                                    name='email'
                                    value={data.email}
                                    onChange={handleOnChange}
                                    className='w-full h-full outline-none bg-transparent'/>
                            </div>
                        </div>

                        <div>
                            <label>Password : </label>
                            <div className='bg-slate-100 p-2 flex'>
                                <input 
                                    type= {showPassword ? "text" : "password"}
                                    placeholder='enter your password'
                                    value={data.password}                                    
                                    name='password'                                    
                                    onChange={handleOnChange}                                    
                                    className='w-full h-full outline-none bg-transparent'/>
                                    <div className='cursor-pointer text-lg' onClick={()=>setShowPassword((preve)=>!preve)}>
                                      <span>
                                      {
                                        showPassword ? (
                                          <RiEyeCloseLine />
                                        )
                                        :
                                        (
                                          <RiEyeCloseFill/>
                                          
                                        )
                                      }                                     
                                      
                                       
                                      </span>
                                    </div>
                                <div className='cursor-pointer text-xl'>                                    
                                </div>
                            </div>
                            <Link to={'/reset'} className='block w-fit ml-auto hover:underline hover:text-red-600  text-red-600 italic'>
                                Reset password
                            </Link>
                        </div>

                        <button className='bg-purple-900 hover:bg-purple-900 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>Login</button>

                    </form>

                    <p className='my-5'>Don't have account ? <Link to={"/sign-up"} className=' text-red-900 hover:text-red-700 hover:underline'>Sign up</Link></p>
            </div>


        </div>
    </section>
  )
}
export default Login