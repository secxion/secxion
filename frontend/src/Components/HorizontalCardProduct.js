import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { Link } from 'react-router-dom'



const HorizontalCardProduct = ({heading}) => {
    const [categoryProduct, setCategoryProduct] = useState([])
    const [loading, setLoading] = useState(false)
    

    const categoryLoading = new Array(3).fill(null)
    


    const fetchCategoryProduct = async() =>{
        setLoading(true)
        const response = await fetch(SummaryApi.categoryProduct.url)
        const dataResponse = await response.json()
        setLoading(false)
        setCategoryProduct(dataResponse.data)
    } 

    useEffect(()=>{
        fetchCategoryProduct()
    },[])

  return (
    <div className=' grid container mx-auto p-4'>

        <h2 className='text-2xl font-semibold py-4'>{heading}</h2>

        <div className='flex items-center gap-2 justify-between overflow-scroll scrollbar-none'>
        {            
            (
                categoryProduct.map((product,index)=>{
                return(
                    <Link to={"product/"+product?._id} className='p-2 cursor-pointer' key={product?._id}>
                    <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-100 flex items-center justify-center'>
                    <img src={product?.productImage[0]} alt="{product?.category}" className='h-full object-scale-down mix-blend-multiply hover:scale-150 transition-all'/>
                        </div>
                        <p className='text-center font-bold text-sm md:text-base capitalize'>{product?.category}</p>
                        </Link>
                )
            })
            )
            
        }
        </div>
    </div>
  )
}

export default HorizontalCardProduct