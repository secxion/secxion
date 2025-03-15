import React, { useEffect, useState, useContext } from "react";
import BlogForm from "../Components/BlogForm";
import BlogCard from "../Components/BlogCard";
import { toast } from "react-toastify";
import SummaryApi from "../common"; 
import Context from "../Context";

const BlogManagement = () => {
  const { fetchBlogs, blogs, token: contextToken } = useContext(Context); 
  const token = contextToken || localStorage.getItem("token") || sessionStorage.getItem("token");
  const [isCreating, setIsCreating] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  console.log("🔹 Token Retrieved:", token ? `✅ ${token}` : "❌ No token found");

  useEffect(() => {
    if (!token) {
      console.warn("⚠️ Unauthorized: No token found.");
      toast.error("Unauthorized access. Please log in.");
      return;
    }
    fetchBlogs();
  }, [fetchBlogs, token]);

  const handleCreateBlog = () => {
    setIsCreating(true);
    setEditingBlog(null);
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setIsCreating(true);
  };

  const handleDeleteBlog = async (id) => {
    try {
      console.log(`🟡 Attempting to delete blog with ID: ${id}`);
      
      const response = await fetch(`${SummaryApi.deleteBlog.url}/${id}`, {
        method: SummaryApi.deleteBlog.method,
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "application/json"
        },
      });

      const responseData = await response.json();
      console.log("🟢 Delete Response:", responseData);

      if (!response.ok) {
        toast.error(responseData.message || "Failed to delete blog.");
        return;
      }

      toast.success(responseData.message || "Blog deleted successfully!");
      await fetchBlogs();
    } catch (error) {
      console.error("❌ Delete Error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="bg-white py-2 px-4 flex justify-between items-center shadow-md rounded">
        <h2 className="font-bold text-lg">Manage Blogs</h2>
        <button
          className="border-2 border-purple-900 text-black hover:bg-purple-800 hover:text-white transition-all py-1 px-3 rounded"
          onClick={handleCreateBlog}
        >
          Create Blog
        </button>
      </header>

      {isCreating && (
        <BlogForm
          onClose={() => setIsCreating(false)}
          fetchBlogs={fetchBlogs}
          editingBlog={editingBlog}
        />
      )}

      <main className="flex items-center flex-wrap gap-3 py-8 h-[calc(100vh-190px)] overflow-y-auto">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              onEdit={handleEditBlog}
              onDelete={handleDeleteBlog}
            />
          ))
        ) : (
          <p className="text-center w-full">No Blogs Available.</p>
        )}
      </main>
    </div>
  );
};

export default BlogManagement;
