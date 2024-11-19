import React, { useEffect, useState } from 'react'
import { useCategoriesStore } from '../../../../store/categoriesStore'
import { motion } from 'framer-motion'
import { FormInput, Select, ImageComponent } from '../../../../components'
import { imagesValidator } from '../../../../shared/validators'
import { Loader } from 'lucide-react'
import { useBrandsStore } from '../../../../store/brandsStore'

const ProductForm = ({ formLabel, submitLabel, handleSubmit, productLoading, newProduct, setNewProduct}) => {
    

    const [fileErrs, setFileErrs] = useState([])
    const {categories, loadCategories} = useCategoriesStore();
    const {brands, loadBrands} = useBrandsStore()
    

    useEffect(() => {
        loadCategories();
        loadBrands()
    },[loadCategories, loadBrands])
    
    const onSubmitHandler = (e) => {
        e.preventDefault()
        handleSubmit()
    }

    
    //file handleChange
  const fileHandleChange = (event) => {
    const newFiles = Array.from(event);

    //validation
    const errors = imagesValidator(newFiles);
    setFileErrs(errors);
    setNewProduct((prevState) => ({...prevState, images: [...newFiles]})) 
    
  }

 
  
    
  return (
    <motion.div
      className="max-w-xl p-8 mx-auto mb-8 bg-gray-800 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="mb-6 text-2xl font-semibold text-emerald-300">
        {formLabel}
      </h2>
      <form onSubmit={onSubmitHandler}>
        <FormInput
          title="Product Name"
          id="name"
          name="name"
          value={newProduct?.name || ""}
          type="text"
          placeholder="Product name"
          required
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />

        <FormInput
          title="Description"
          id="description"
          name="description"
          value={newProduct?.description || ""}
          type="textarea"
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
          value={newProduct?.price || ""}
          type="number"
          min="0"
          step="0.01"
          placeholder="Product price"
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />

        <FormInput
          title="Quantity"
          id="quantity"
          name="quantity"
          value={newProduct?.quantity || ""}
          type="number"
          min="0"
          step="1"
          placeholder="Product quantity"
          onChange={(e) =>
            setNewProduct({ ...newProduct, quantity: e.target.value })
          }
        />

        <Select
          title="Category"
          id="category"
          name="category"
          selectInstruction="Select a category"
         
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          data={categories}
        />

        <Select
          title="Brand"
          id="brand"
          name="brand"
          selectInstruction="Select a brand"
          
          newProduct={newProduct}
          setNewProduct={setNewProduct}
          data={brands}
        />

        {/* upload images */}
        <ImageComponent
          label="Upload images"
          /* value={newProduct.images} */
          onFileChangeHandler={fileHandleChange}
          multiple
          imageErrors={fileErrs}
        />

        <motion.button
          className="w-full px-4 py-3 mt-5 font-bold text-white transition duration-200 rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={productLoading || fileErrs?.length > 0}
        >
          {productLoading ? (
            <Loader className="mx-auto size-6 animate-spin" />
          ) : (
            `${submitLabel}`
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}

export default ProductForm