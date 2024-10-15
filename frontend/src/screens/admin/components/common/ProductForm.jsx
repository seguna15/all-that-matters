import React, { useEffect, useState } from 'react'
import { useCategoriesStore } from '../../../../store/categoriesStore'
import { motion } from 'framer-motion'
import { FormInput, Select, ImageComponent } from '../../../../components'

const ProductForm = () => {
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        images: "",
        quantity: ""
    })

    const [fileErrs, setFileErrs] = useState([])

    const {categories, loadCategories} = useCategoriesStore()

    useEffect(() => {
        loadCategories();
    },[loadCategories])
    
    const handleSubmit = (e) => {
        e.preventDefault()
    }

    const imagesValidator = (images) => {
        let newErrs = [];
        
        if(images.length > 0){
        images.forEach((file) => {
            if (file?.size > 1000000) {
            newErrs.push(`${file?.name} is too large`);
            }

            if (!file?.type?.startsWith("image/")) {
            newErrs.push(`${file?.name} is not an image`);
            }
        });
        }else{
        if (images?.size > 1000000) {
            newErrs.push(`${images?.name} is too large`);
            }

            if (!images?.type?.startsWith("image/")) {
            newErrs.push(`${images?.name} is not an image`);
            }
        }
        
    
        return newErrs
    }
    //file handleChange
  const fileHandleChange = (event) => {
    const newFiles = Array.from(event);
    //validation
    const errors = imagesValidator(newFiles);
    setFileErrs(errors);
    setFiles(newFiles)
  }
    
  return (
    <motion.div
      className="max-w-xl p-8 mx-auto mb-8 bg-gray-800 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="mb-6 text-2xl font-semibold text-emerald-300">
        Create New Product
      </h2>
      <form onSubmit={handleSubmit}>
        <FormInput
          title="Product Name"
          id="name"
          name="name"
          value={newProduct.name}
          type="email"
          placeholder="Product name"
          required
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />

        <FormInput
          textarea
          title="Description"
          id="description"
          name="description"
          value={newProduct.description}
          placeholder="Product description"
          required
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
        />

        <FormInput
          title="Price"
          id="price"
          name="price"
          value={newProduct.price}
          type="number"
          min="0"
          step="0.01"
          placeholder="Product price"
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />

        <Select 
            title="Category" 
            id="category" 
            selectInstruction="Select a category"
            newProduct={newProduct} 
            setNewProduct={setNewProduct} 
            categories={categories} 
        />

        {/* upload images */}
        <ImageComponent
            label="Upload images"
            value={newProduct.images}
            onFileChangeHandler={fileHandleChange}
            multiple
            imageErrors={fileErrs}
        />
      </form>
    </motion.div>
  );
}

export default ProductForm