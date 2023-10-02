/* eslint-disable react/jsx-props-no-spreading */
import { AppliedFilters, ProductGrid, ProductList } from '@/components/product';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { selectFilter } from '@/selectors/selector';
import axios from 'axios';
import { MessageDisplay } from '@/components/common';
import Marketing from '@/components/common/Marketing';


const AiSearch = () => {
    useDocumentTitle('Shop | AiSearch');
    useScrollTop();

    const store = useSelector((state) => ({
        filteredProducts: selectFilter(state.products.items, state.filter),
        products: state.products,
        requestStatus: state.app.requestStatus,
        isLoading: state.app.loading
    }), shallowEqual);

    const [photo, setPhoto] = useState(null);
    const [Error, setError] = useState(null);


    const [product, setProduct] = useState([]);



    const handlePhotoChange = (event) => {
        setPhoto(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("photo", photo);
        setError(null)

        axios.post("http://127.0.0.1:8000/api/upload-photo/", formData)
            .then((response) => {
                if (response.data.products) {
                    console.log(response.data.products)
                    setProduct(response.data.products);
                } else {
                    setError(response.data.message)
                }


            })
            .catch((error) => {
                console.log(error)
            });
            console.log(product)
    };
    return (
        <main className="content" style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px 0px" }}>
                <h1>Search For your product Faster </h1>
            </div>

            <form for="images" className="drop-container" onSubmit={handleSubmit}>
                <span className="drop-title">Drop Image here</span>
                or
                <input type="file" id="images" accept="image/*" onChange={handlePhotoChange} required />

                <button style={{ background: "black", color: "white", padding: "8px", fontWeight: "500" }} type="submit">Upload</button>
            </form>

            <div>
                {Error && <>{Error}</>}
        
            </div>
         
            {product.length == 0 ? 
            <MessageDisplay
                message={"No Product"}
              
            />
                :
                <>

                <section className="product-list-wrapper">
                    <AppliedFilters filteredProductsCount={product.length} />
                        <ProductGrid products={product} />
                </section></>}
                <Marketing />

        </main>
    );
};
export default AiSearch