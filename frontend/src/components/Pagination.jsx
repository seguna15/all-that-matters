import React from 'react'

export const Pagination = ({...props}) => {
  
  const handleLimit = (e) => {
    props.setPage(1)
    props.setLimit(e.target.value);
  }


  return (
    <div className="flex items-center justify-between px-4 py-1 mt-[20px] ">
      <div className="flex items-center gap-2 rtl:space-x-reverse">
        <select
          className="h-8 px-2 text-sm text-white leading-none transition duration-75 bg-green-500 border-green-300 rounded-lg shadow-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-inset focus:ring-emerald-500"
          onChange={handleLimit}
          name="limit"
          value={props.limit}
        >
          <option value="">limit</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
        <span className="text-sm font-medium">per page</span>
      </div>

      
      <div className="pl-2 text-sm font-medium hidden md:flex items-center text-white">
        Showing{" "}
        {props.page === 1
          ? 1
          : `${props.page * props.limit - (props.limit - 1)}`}{" "}
        to{" "}
        {props.page < 1
          ? `${props.page * props.limit}`
          : `${(props.page - 1) * props.limit + props.results}`}{" "}
        of {props.total} results
      </div>
    

      <nav className="flex items-center space-x-1">
        <button
          onClick={(e) => props.setPage((props.page -= 1))}
          disabled={!props.pagination?.prev}
          type="button"
          className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-white hover:bg-green-500 disabled:opacity-50 disabled:pointer-events-none"
        >
          <span aria-hidden="true">«</span>
          <span className="sr-only">Previous</span>
        </button>

        {props.pagination?.prev && (
          <button
            onClick={(e) => props.setPage(props.page - 1)}
            type="button"
            className="min-w-[40px] flex justify-center items-center text-white hover:bg-green-500 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none"
            aria-current="page"
          >
            {props.page - 1}
          </button>
        )}
        <button
          onClick={(e) => props.setPage(props.page)}
          type="button"
          className="min-w-[40px] flex justify-center items-center text-white bg-green-600 hover:bg-green-500 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none "
          aria-current="page"
        >
          {props.page ? props.page : 1}
        </button>
        {props.pagination?.next && (
          <button
            onClick={(e) => props.setPage(props.page + 1)}
            type="button"
            className="min-w-[40px] flex justify-center items-center text-white hover:bg-green-500 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none"
            aria-current="page"
          >
            {props.page + 1}
          </button>
        )}

        <button
          onClick={(e) => props.setPage((props.page += 1))}
          disabled={!props.pagination?.next}
          type="button"
          className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-white hover:bg-green-500 disabled:opacity-50 disabled:pointer-events-none"
        >
          <span className="sr-only">Next</span>
          <span aria-hidden="true">»</span>
        </button>
      </nav>
    </div>
  );
};
