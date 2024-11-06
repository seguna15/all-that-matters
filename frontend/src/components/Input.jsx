
export const Input = ({icon:Icon,...props}) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="text-gray-500 size-5" />
      </div>
      <input
        {...props}
        className="w-full py-2 pl-10 pr-3 text-white placeholder-gray-400 transition duration-200 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}

export const FormInput = ({...props}) => {
  return(
    <div className='relative mb-6'>
      <label htmlFor={props.id} className='block mb-1 text-sm font-medium text-gray-300'>{props.title}</label> 
       {
          props?.type === "textarea" ?  
            (
              <textarea 
                {...props}
                className='block w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-emerald-500 focus:border-emerald-500'>
              </textarea>
            )
          :  
          (
            <input 
              {...props}
              className='block w-full px-3 py-2 text-white placeholder-gray-400 transition duration-200 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500'
            />
          )
        }
    </div>
    
  )
}

export const Select = ({...props}) => {
  

  return (
    <div className="relative mb-6">
      <label
        htmlFor={props?.id}
        className="block mb-1 text-sm font-medium text-gray-300"
      >
        {props?.title}
      </label>
      <select
        className="block w-full px-3 py-2 text-white placeholder-gray-400 transition duration-200 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500"
        name={props?.name}
        onChange={(e) =>
          props?.setNewProduct({
            ...props?.newProduct,
            [e.target.name]: e.target.value,
          })
        }
        value={props?.newProduct?.[props?.name]}
      >
        <option value="">{props?.selectInstruction}</option>
        {props?.data?.map((item) => (
          <option key={item?._id} value={item?._id}>
            {item?.name}
          </option>
        ))}
      </select>
    </div>
  );
}



