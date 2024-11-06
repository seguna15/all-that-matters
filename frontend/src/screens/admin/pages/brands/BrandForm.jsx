import { motion } from 'framer-motion'
import { FormInput } from '../../../../components'
import { Loader } from 'lucide-react'

const BrandForm = ({
  formLabel,
  handleSubmit,
  isLoading,
  newBrand,
  setNewBrand,
  submitLabel,
}) => {

  const onSubmitHandler = (e) => {
    e.preventDefault();
    handleSubmit();
  };

 
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
          title="Brand Name"
          id="name"
          name="name"
          value={newBrand?.name || ''}
          type="text"
          placeholder="Brand name"
          required
          onChange={(e) =>
            setNewBrand({ ...newBrand, name: e.target.value })
          }
        />

      
        <motion.button
          className="w-full px-4 py-3 mt-5 font-bold text-white transition duration-200 rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="mx-auto size-6 animate-spin" />
          ) : (
            `${submitLabel}`
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default BrandForm