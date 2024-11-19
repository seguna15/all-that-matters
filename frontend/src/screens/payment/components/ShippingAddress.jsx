import React from 'react'

const ShippingAddress = ({
  shippingAddress,
  useAsShippingAddress,
  onCountryChange,
  setUseAsShippingAddress,
  countryList,
  onInputChange,
  handleInputValidationOnBlur,
  isAddressValid,
}) => {
  

  const handleChange = (e) => {
    onInputChange(e.target.id, e.target.value);
  };

  const handleBlur = (e) => {
    handleInputValidationOnBlur(e.target.value, e.target.id);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold text-gray-700 dark:text-white">
          Shipping Address
        </h2>
        {!isAddressValid && (
          <span className="block mb-2 text-sm text-red-500">
            * fields are required
          </span>
        )}

        <div className="grid gap-4 grid-col-1 md:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="block text-gray-700 dark:text-white mb-1 after:content-['*'] after:text-red-500 after:ml-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={shippingAddress?.firstName?.value || ""}
              name="firstName"
              autoComplete="new-password"
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-none"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-gray-700 dark:text-white mb-1 after:content-['*'] after:text-red-500 after:ml-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={shippingAddress?.lastName?.value || ""}
              name="lastName"
              autoComplete="new-password"
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="address"
            className="block text-gray-700 dark:text-white mb-1 after:content-['*'] after:text-red-500 after:ml-1"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            value={shippingAddress?.address?.value || ""}
            name="address"
            autoComplete="new-password"
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-none"
          />
        </div>

        <div className="grid gap-4 mt-4 grid-col-1 md:grid-cols-2">
          <div>
            <label
              htmlFor="city"
              className="block text-gray-700 dark:text-white mb-1 after:content-['*'] after:text-red-500 after:ml-1"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              value={shippingAddress?.city?.value || ""}
              name="city"
              autoComplete="new-password"
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-none"
            />
          </div>

          <div>
            <label
              htmlFor="state"
              className="block text-gray-700 dark:text-white mb-1 after:content-['*'] after:text-red-500 after:ml-1"
            >
              State
            </label>
            <input
              type="text"
              id="state"
              value={shippingAddress?.state?.value || ""}
              name="state"
              autoComplete="new-password"
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-none"
            />
          </div>
        </div>

        <div className="grid gap-4 mt-4 grid-col-1 md:grid-cols-2">
          <div>
            <label
              htmlFor="country"
              className="block text-gray-700 dark:text-white mb-1 after:content-['*'] after:text-red-500 after:ml-1"
            >
              Country
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-none"
              id="country"
              name="country"
              autoComplete="new-password"
              onChange={(e) => onCountryChange(e.target.value)}
              onBlur={handleBlur}
              value={shippingAddress?.country?.value || ""}
            >
              <option value="">Choose country</option>
              {countryList?.map((country) => (
                <option key={country?.code} value={country?.name}>
                  {country?.emoji} {country?.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-gray-700 dark:text-white mb-1 after:content-['*'] after:text-red-500 after:ml-1"
            >
              Phone Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="phoneCode"
                name="phoneCode"
                autoComplete="new-password"
                value={shippingAddress?.phoneCode?.value || ""}
                onBlur={handleBlur}
                className="w-16 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-none"
                disabled
              />
              <input
                type="text"
                id="phoneNumber"
                value={shippingAddress?.phoneNumber?.value || ""}
                name="phoneNumber"
                autoComplete="new-password"
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label
              htmlFor="zipCode"
              className="block mb-1 text-gray-700 dark:text-white"
            >
              ZIP Code
            </label>
            <input
              type="text"
              id="zipCode"
              value={shippingAddress?.zipCode?.value || ""}
              name="zipCode"
              autoComplete="new-password"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-none"
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="useAssShippingAddress">
              Set as user's shipping address
            </label>
            <input
              type="checkbox"
              name="useAsUserShippingAddress"
              id="useAsUserShippingAddress"
              className="ml-1"
              onChange={(e) => setUseAsShippingAddress(!useAsShippingAddress)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddress