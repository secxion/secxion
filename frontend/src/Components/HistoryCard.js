import React, { useState } from "react";
import HistoryDetailView from './HistoryDetailView';

const HistoryCard = ({ data }) => {
  const [showDetailView, setShowDetailView] = useState(false);
  
  const handleViewMore = () => {
    setShowDetailView(true);
  };

  return (
    <>
      <div className='bg-white p-4 rounded shadow-md'>
        <div className='w-full'>
          <p className="text-gray-600 mt-1">
            Market ID: <span className='truncate block'>{data._id}</span>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            CreatedAt: <span className='truncate block'>{data.timestamp ? new Date(data.timestamp).toLocaleString() : "N/A"}</span>
          </p>
          <button 
            onClick={handleViewMore} 
            className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full">
            View More
          </button>
        </div>
      </div>

      {showDetailView && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
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
