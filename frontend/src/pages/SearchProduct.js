import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SummaryApi from "../common";
import VerticalCard from "../Components/VerticalCard";

const SearchProduct = () => {
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get("query") || ""; // ✅ Extract query correctly

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProduct = async () => {
        if (!searchQuery.trim()) return; // ✅ Prevent empty search calls

        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`${SummaryApi.searchProduct.url}?query=${encodeURIComponent(searchQuery)}`, {
                credentials: "include", // ✅ Ensures authentication/session cookies
            });

            if (!response.ok) {
                throw new Error("Failed to fetch search results.");
            }

            const dataResponse = await response.json();
            setData(dataResponse.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [searchQuery]); // ✅ Runs when search query changes

    return (
        <div className="container mx-auto p-4">
            {loading && <p className="text-lg text-center">Loading...</p>}

            {error && (
                <p className="bg-red-100 text-red-600 text-lg text-center p-4 rounded">
                    {error}
                </p>
            )}

            <p className="text-lg font-semibold my-3">
                Search Results: {data.length}
            </p>

            {data.length === 0 && !loading && !error && (
                <p className="bg-white text-lg text-center p-4 rounded shadow">
                    No Data Found...
                </p>
            )}

            {data.length > 0 && !loading && <VerticalCard data={data} />}
        </div>
    );
};

export default SearchProduct;
