import React, { useContext } from 'react'
import scrollTop from '../helpers/scrollTop'
import Context from '../Context'
import addToCart from '../helpers/addToCart'
import { Link } from 'react-router-dom'

const VerticalCard = ({loading,data = []}) => {
    const loadingList = new Array(13).fill(null)
    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async(e,id)=>{
       await addToCart(e,id)
       fetchUserAddToCart()
    }

  return (
    <div className='flex grid-cols-[repeat(auto-fit,minmax(160px,200px))] justify-between md:justify-between md:gap-4 gap-4 transition-all'>
    dfhbb
    {

         loading ? (
             loadingList.map((product,index)=>{
                 return(
                     <div className='w-full min-w-[280px]  md:min-w-[320px] max-w-[280px] md:max-w-[320px]  bg-white rounded-sm shadow '>
                         <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center animate-pulse'>
                         </div>
                         <div className='p-4 grid gap-3'>
                             <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200'></h2>
                             <p className='capitalize text-slate-500 p-1 animate-pulse rounded-full bg-slate-200  py-2'></p>
                             <div className='flex gap-3'>
                                 <p className='text-red-600 font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full  py-2'></p>
                                 <p className='text-slate-500 line-through p-1 animate-pulse rounded-full bg-slate-200 w-full  py-2'></p>
                             </div>
                             <button className='text-sm  text-white px-3  rounded-full bg-slate-200  py-2 animate-pulse'></button>
                         </div>
                     </div>
                 )
             })
         ) : (
             data.map((product,index)=>{
                 return(
                     <Link to={"/product/"+product?._id} className='w-full min-w-[180px]  md:min-w-[200px] max-w-[180px] md:max-w-[200px]  bg-white rounded-sm shadow ' onClick={scrollTop}>
                         <div className='w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden p-2 bg-slate-100 flex items-center justify-center'>
                         hello
                             <img src={product?.productImage[0]} alt='' className='h-full object-scale-down mix-blend-multiply hover:scale-150 transition-all'/>
                         </div>
                         <div className='p-2 col-auto flex-col gap-1'>
                             <h2 className='font-medium text-base md:text- text-ellipsis line-clamp-1 text-black'>{product?.productName}</h2>
                             {/* <p className='capitalize text-slate-500'>{product?.category}</p> */}
                             <div>
                                 {/* <p className='text-red-600 font-medium'>{(product?.sellingPrice)}</p> */}
                                 {/* <p className='text-slate-500 line-through'>{ (product?.facevalue)  }</p> */}
                             </div>
                             {/* <button className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full' onClick={(e)=>handleAddToCart(e,product?._id)}>Add to Catalog</button> */}
                         </div>
                     </Link>
                 )
             })
         )
         
     }
    </div>
  )
}

export default VerticalCard