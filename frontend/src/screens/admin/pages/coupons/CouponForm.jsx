import React, {useState } from 'react'
import { motion } from 'framer-motion'
import { FormInput } from '../../../../components'

import { Loader } from 'lucide-react'
import { usDate } from '../../../../shared/utils/date'

const CouponForm = ({ formLabel, submitLabel, handleSubmit, couponLoading, newCoupon, setNewCoupon}) => {
  
  const onSubmitHandler = (e) => {
      e.preventDefault()
      handleSubmit()
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
          title="Coupon code"
          id="code"
          name="code"
          value={newCoupon?.code || ""}
          type="text"
          placeholder="Coupon code"
          required
          onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
        />

        <FormInput
          title="Discount Percentage (%)"
          id="discountPercentage"
          name="discountPercentage"
          value={newCoupon?.discountPercentage || ""}
          type="number"
          min="0"
          placeholder="Product quantity"
          onChange={(e) =>
            setNewCoupon({ ...newCoupon, discountPercentage: e.target.value })
          }
        />

        <FormInput
          title="Max Usage"
          id="maxUsage"
          name="maxUsage"
          value={newCoupon?.maxUsage || ""}
          type="number"
          min="0"
          placeholder="Product quantity"
          onChange={(e) =>
            setNewCoupon({ ...newCoupon, maxUsage: e.target.value })
          }
        />

        <FormInput
          title="Expiration Date"
          id="expirationDate"
          name="expirationDate"
          value={usDate(newCoupon?.expirationDate) || ""}
          type="date"
          placeholder="Product quantity"
          onChange={(e) =>
            setNewCoupon({ ...newCoupon, expirationDate: e.target.value })
          }
        />

        <motion.button
          className="w-full px-4 py-3 mt-5 font-bold text-white transition duration-200 rounded-lg shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={couponLoading}
        >
          {couponLoading ? (
            <Loader className="mx-auto size-6 animate-spin" />
          ) : (
            `${submitLabel}`
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}

export default CouponForm