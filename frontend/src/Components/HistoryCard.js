import React, { useState } from "react";
import HistoryDetailView from './HistoryDetailView';

const HistoryCard = ({ data }) => {
  const [showDetailView, setShowDetailView] = useState(false);
  
  const handleViewMore = () => {
    setShowDetailView(true);
  };

  return (
    <>
      <div className='bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105'>
        <div className='w-full'>
          <p className="text-gray-700 font-semibold">
            Market ID: <span className='truncate block'>{data._id}</span>
          </p>
          <p className="text-gray-600 text-sm mt-1">
            Created At: <span className='truncate block'>{data.timestamp ? new Date(data.timestamp).toLocaleString() : "N/A"}</span>
          </p>
          <button 
            onClick={handleViewMore} 
            className="mt-4 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-200 w-full">
            View More
          </button>
        </div>
      </div>

      {showDetailView && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <HistoryDetailView
            productDetails={data}
            onClose={() => setShowDetailView(false)}
          />
        </div>
      )}
    </>
  );
};

export default HistoryCard;