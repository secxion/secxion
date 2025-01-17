import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, } from 'react-router-dom'
import productCategory from '../helpers/productCategory'
import VerticalCard from '../Components/VerticalCard'
import SummaryApi from '../common'

const CategoryProduct = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const urlSearch = new URLSearchParams(location.search)
    const urlCategoryListinArray = urlSearch.getAll("category")

    const urlCategoryListObject = {}
    urlCategoryListinArray.forEach(el =>{
      urlCategoryListObject[el] = true
    })


    const [selectCategory, setSelectCategory] = useState(urlCategoryListObject)
    const [filterCategoryList, setFilterCategoryList] = useState([])

    const [sortBy, setSortBy] = useState("")

    const fetchData = async()=>{
      const response = await fetch(SummaryApi.filterProduct.url,{
        method : SummaryApi.filterProduct.method,
        headers : {
          "content-type" : "application/json" 
        },
        body : JSON.stringify({
          category : filterCategoryList
        })
      })

      const dataResponse = await response.json()

      setData(dataResponse?.data || [])
    }

    const handleSelectCategory = (e) =>{
      const {name, value, checked} = e.target

      setSelectCategory((preve)=>{
        return{
          ...preve,
          [value] : checked
        }
      })

    }

    useEffect(()=>{
      fetchData()
    },[filterCategoryList])

    useEffect(()=>{
      const arrayOfCategory = Object.keys(selectCategory).map(categoryKeyName =>{
        if(selectCategory[categoryKeyName]){
          return categoryKeyName
        }
        return null
      }).filter(el => el)

      setFilterCategoryList(arrayOfCategory)

      // format for url change when change on the checkbox
      const urlFormat = arrayOfCategory.map((el, index) => {
        if((arrayOfCategory.length - 1) === index ){
          return `${el}`
        }
        return `${el}&`
      })

      navigate("/product-category?"+urlFormat.join(""))
    },[selectCategory])

    const handleOnchangeSortBy = (e)=>{
      const { value } = e.target

      setSortBy(value)

      if(value === 'asc'){
        setData(preve => preve.sort((a,b)=>a.sellingPrice - b.sellingPrice))
      }

      if(value === 'dsc'){
        setData(preve => preve.sort((a,b)=>b.sellingPrice - a.sellingPrice))
      }
    }

    useEffect(()=>{
      
    },[sortBy])
    

  return (
    <div className='container mx-auto p-4'>

      {/**desktop version */}  
      <div className='lg:grid grid-cols-[200px,1fr]'>
        {/**left side */}
        <div className='bg-slate-300 p-2 min-h-[calc(40vh-55px)]'>
            {/**sort by */}
            <div className=''>
                <h3 className='text-base uppercase font-medium text-slate-800 border-b pb-1 border-slate-500'>Sort by</h3>

                <form className='text-sm flex flex-col gap-2 py-2'>
                  <div className='flex items-center gap-3'>
                    <input type='radio' name='sortBy' checked={sortBy === 'asc'} onChange={handleOnchangeSortBy} value={'asc'}/>
                    <label>Price - Low to High</label>
                  </div>

                  <div className='flex items-center gap-3'>
                    <input type='radio' name='sortBy' checked={sortBy === 'dsc'} onChange={handleOnchangeSortBy} value={"dsc"} />
                    <label>Price - High to Low</label>
                  </div>
                </form>
            </div>

            {/**filter by */}
            <div className=''>
                <h3 className='text-base uppercase font-medium text-slate-800 border-b pb-1 border-slate-500'>Category</h3>

                <form className='text-sm flex flex-col gap-2 py-2'>
                  {
                    productCategory.map((categoryName, index)=>{
                      return(
                        <div className='flex items-center gap-3'>
                          <input type='checkbox' name={'category'} checked={selectCategory[categoryName?.value]} value={categoryName?.value} id={categoryName?.value} onChange={handleSelectCategory}/>
                          <label htmlFor={categoryName.value}>{categoryName?.value}</label>
                        </div>
                      )
                    })
                  }
                </form>
            </div>


        </div>

        {/**right side (product) */}
        <div className='px-4'>
            <p className='font-medium text-slate-950 text-lg my-2'>Results : {data.length}</p>

        <div className='min-h-[calc(100vh-120px)]  max-h-[calc(50vh-60px)]'>
          {
            data.length !== 0 && (
              <VerticalCard data={data} loading={loading}/>
            )
          }
        </div>

        </div>
      </div>

      </div>    
  )
}

export default CategoryProduct