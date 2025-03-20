const backendDomain = "http://localhost:5000";

const SummaryApi = {
    signUP : {
        url : `${backendDomain}/api/signup`,
        method : "post"
    },
    signIn : {
        url : `${backendDomain}/api/signin`,
        method : "post"
    },
   current_user : {
        url : `${backendDomain}/api/user-details`,
        method : "get"
    },
    logout_user : {
        url : `${backendDomain}/api/userLogout`,
        method : "get"
    },
    allUser : {
        url : `${backendDomain}/api/all-user`,
        method : "get"
    },
    updateUser : {
        url : `${backendDomain}/api/update-user`,
        method : "post"
    },
    deleteUser : {
        url : `${backendDomain}/api/delete-user`,
        method : "post"
    },    
    uploadProduct : {
        url : `${backendDomain}/api/upload-product`,
        method : 'post'
    },
    
    allProduct : {
        url : `${backendDomain}/api/get-product`,
        method : 'get'
    },
    
    updateProduct : {
        url : `${backendDomain}/api/update-product`,
        method : 'post'
    },
    marketRecord : {
        url : `${backendDomain}/api/market-record`,
        method : 'post'
    },
    userMarket : {
        url : `${backendDomain}/api/upload-market`,
        method : 'post'
    },
    myMarket : {
        url : `${backendDomain}/api/get-market`,
        method : 'get'
    },
    allUserMarkets : {
        url : `${backendDomain}/api/get-all-users-market`,
        method : 'get'
    },
    updateMarketStatus : {
        url : `${backendDomain}/api/update-market-status`,
        method : 'post'
    },
    createNotification : {
        url : `${backendDomain}/api/create-notification`,
        method : 'post'
    },
    categoryProduct : {
        url : `${backendDomain}/api/get-categoryProduct`,
        method : 'get'
    },
    categoryWiseProduct : {
        url : `${backendDomain}/api/category-product`,
        method : 'post'
    },
    productDetails : {
        url : `${backendDomain}/api/product-details`,
        method : 'post'
    },
    searchProduct : {
        url : `${backendDomain}/api/search`,
        method : 'get'
    },
    filterProduct : {
        url : `${backendDomain}/api/filter-product`,
        method : 'post'
    },
    createBlog : {
        url : `${backendDomain}/api/create-blog`,
        method : 'post'
    },
    getBlogs : {
        url : `${backendDomain}/api/get-blogs`,
        method : 'get'
    },
    updateBlog : {
        url : `${backendDomain}/api/update-blog`,
        method : 'put'
    },
    deleteBlog : {
        url : `${backendDomain}/api/delete-blog`,
        method : 'delete'
    },
    
    sendMessage: {
        url: `${backendDomain}/api/send-message`,
        method: "POST"
    },
   
    markMessagesAsRead: {
        url: `${backendDomain}/api/mark-as-read/:senderId`,
        method: "PUT"
    },
    getAdmins: {
        url: `${backendDomain}/api/admins`,
        method: "GET"
    },
    getUserMessage: {
        url: `${backendDomain}/api/getusermessage`,
        method: "GET"
    },
    adminGetMessages: {
        url: `${backendDomain}/api/receive`,
        method: "POST"
    },
    adminSendMessage: {
        url: `${backendDomain}/api/reply`,
        method: "POST"
    },
    

  
   
}

export default SummaryApi;
