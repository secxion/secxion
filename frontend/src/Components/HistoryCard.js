import React from 'react';
import displayUSDCurrency from '../helpers/displayCurrency';

const HistoryCard = ({ data, fetchdata }) => {
  return (
    <div className='bg-white p-4 rounded '>
      <div className='w-40'>
        <div className='w-32 h-32 flex justify-center items-center'>
          {data?.Image?.[0] ? (
            <img
              src={data.Image[0]}
              alt='Product'
              className='mx-auto object-fill h-full'
            />
          ) : (
            <p className='text-gray-500'>No Image Available</p>
          )}
        </div>
        <h1 className='text-ellipsis line-clamp-2'>{data.totalAmount}</h1>
        <div>
          <p className='font-semibold'>{displayUSDCurrency(data.description)}</p>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
