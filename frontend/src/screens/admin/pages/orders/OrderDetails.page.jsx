import { useEffect } from "react";
import { useOrdersStore } from "../../../../store/ordersStore";
import Header from "../../components/common/Header";
import { useParams } from "react-router-dom";
import { serverURL } from "../../../../api";
import { Spinner } from "../../../../components";



export default function OrderDetailsPage() {
  const {id} = useParams()
  const {order, getOrder, isLoading} = useOrdersStore();
  
  useEffect(() => {
    getOrder(id)
  },[getOrder, id])

 
  return (
    <div className="relative z-10 flex-1 overflow-auto">
      <Header title={`Order: ${order?.paymentSessionID}`} />

      <main className="px-4 pt-16 pb-24 text-gray-800 bg-white dark:bg-gray-800 dark:text-gray-100 sm:px-6 sm:pt-24 lg:px-8 lg:py-32">
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="max-w-xl">
              <h1 className="text-sm font-semibold tracking-wide text-indigo-600 uppercase dark:text-emerald-600">
                Thank you!
              </h1>
              <p
                className={`mt-2 w-fit text-3xl capitalize font-extrabold tracking-tight sm:text-2xl ${
                  order?.paymentStatus === "paid"
                    ? " text-green-800"
                    : " text-yellow-800"
                } `}
              >
                {order?.paymentStatus}{" "}
              </p>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-100">
                Your order {order?.paymentSessionID} is {order?.orderStatus} and
                will be with you soon.
              </p>

              <dl className="mt-12 text-sm font-medium">
                <dt className="text-gray-900 dark:text-gray-100">
                  Order number
                </dt>
                <dd className="mt-2 text-indigo-600 dark:text-emerald-600">
                  {order?.paymentSessionID}
                </dd>
              </dl>
            </div>

            <section
              aria-labelledby="order-heading"
              className="mt-10 border-t border-gray-200"
            >
              <h2 id="order-heading" className="sr-only">
                Your order
              </h2>

              <h3 className="sr-only">Items</h3>
              {order?.orderItems?.map((orderItem) => (
                <div
                  key={orderItem?._id?._id}
                  className="flex py-10 space-x-6 border-b border-gray-200"
                >
                  <img
                    src={`${serverURL}/${orderItem?._id?.images[0]}`}
                    alt={orderItem?._id?.name}
                    className="flex-none object-cover object-center w-20 h-20 bg-gray-100 rounded-lg "
                  />
                  <div className="flex flex-col flex-auto">
                    <div>
                      <h4 className="font-medium text-gray-900 capitalize dark:text-white">
                        {orderItem?._id?.name}
                      </h4>
                    </div>
                    <div className="flex items-end flex-1 mt-6">
                      <dl className="flex space-x-4 text-sm divide-x divide-gray-200 sm:space-x-6">
                        <div className="flex">
                          <dt className="font-medium text-gray-900 dark:text-white">
                            Quantity
                          </dt>
                          <dd className="ml-2 text-gray-700 dark:text-gray-100">
                            {orderItem?.boughtQty}
                          </dd>
                        </div>
                        <div className="flex pl-4 sm:pl-6">
                          <dt className="font-medium text-gray-900 dark:text-white">
                            Price
                          </dt>
                          <dd className="ml-2 text-gray-700 dark:text-gray-100">
                            &#8358;{orderItem?.price?.toFixed(2)}
                          </dd>
                        </div>
                        <div className="flex pl-4 sm:pl-6">
                          <dt className="font-medium text-gray-900 dark:text-white">
                            Total
                          </dt>
                          <dd className="ml-2 text-gray-700 dark:text-gray-100">
                            &#8358;
                            {(orderItem?.boughtQty * orderItem?.price)?.toFixed(
                              2
                            )}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              ))}

              <div className="sm:ml-40 sm:pl-6">
                <h3 className="sr-only">Your information</h3>

                <h4 className="sr-only">Addresses</h4>
                <dl className="grid grid-cols-2 py-10 text-sm gap-x-6">
                  <div>
                    <dt className="font-medium text-gray-900 dark:text-white">
                      Shipping address
                    </dt>
                    <dd className="mt-2 text-gray-700 dark:text-gray-100">
                      <address className="not-italic">
                        <span className="block">
                          {order?.shippingAddress?.address},
                        </span>
                        <span className="block">
                          {order?.shippingAddress?.city},
                        </span>
                        <span className="block">
                          {order?.shippingAddress?.state},
                        </span>
                        <span className="block">
                          {order?.shippingAddress?.country}
                        </span>
                        <span className="block">
                          {order?.shippingAddress?.zipCode}
                        </span>
                        <span className="block">
                          {order?.shippingAddress?.phoneNumber?.code}
                          {order?.shippingAddress?.phoneNumber?.number}
                        </span>
                      </address>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-900 dark:text-white">
                      Billing address
                    </dt>
                    <dd className="mt-2 text-gray-700 dark:text-gray-100">
                      <address className="not-italic">
                        <span className="block">
                          {order?.shippingAddress?.address},
                        </span>
                        <span className="block">
                          {order?.shippingAddress?.city},
                        </span>
                        <span className="block">
                          {order?.shippingAddress?.state},
                        </span>
                        <span className="block">
                          {order?.shippingAddress?.country}
                        </span>
                        <span className="block">
                          {order?.shippingAddress?.zipCode}
                        </span>
                        <span className="block">
                          {order?.shippingAddress?.phoneNumber?.code}
                          {order?.shippingAddress?.phoneNumber?.number}
                        </span>
                      </address>
                    </dd>
                  </div>
                </dl>

                <h4 className="sr-only">Payment</h4>
                <dl className="grid grid-cols-2 py-10 text-sm border-t border-gray-200 gap-x-6">
                  <div>
                    <dt className="font-medium text-gray-900 dark:text-white">
                      Payment method
                    </dt>
                    <dd className="mt-2 text-gray-700 capitalize dark:text-gray-100">
                      <p className="text-sm text-green-600">
                        {order?.paymentMethod}
                      </p>{" "}
                      <p className="text-sm text-orange-600">
                        {order?.paymentProvider}
                      </p>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-900 dark:text-white">
                      Shipping method
                    </dt>
                    <dd className="mt-2 text-gray-700 dark:text-gray-100">
                      <p>Call Us</p>
                      <p>Call 08059059956 for shipping fee and options</p>
                    </dd>
                  </div>
                </dl>

                <h3 className="sr-only">Summary</h3>

                <dl className="pt-10 space-y-6 text-sm border-t border-gray-200">
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-900 dark:text-white">
                      Subtotal
                    </dt>
                    <dd className="text-gray-700 dark:text-gray-100">
                      &#8358;{order?.subTotal?.toFixed(2)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="flex items-center font-medium text-gray-900 dark:text-white">
                      Discount
                      <span className="ml-2 text-xs text-gray-600 dark:text-gray-200">
                        {order?.coupon?.code}
                      </span>
                    </dt>
                    <dd className="text-gray-700 dark:text-gray-100">
                      -&#8358;{order?.saving?.toFixed(2)} (
                      {order?.coupon?.percentage}%)
                    </dd>
                  </div>
                  {/* <div className="flex justify-between">
                  <dt className="font-medium text-gray-900 dark:text-white">
                    Shipping
                  </dt>
                  <dd className="text-gray-700 dark:text-gray-100">
                   &#8358;5.00
                  </dd>
                </div> */}
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-900 dark:text-white">
                      Total
                    </dt>
                    <dd className="text-gray-900 dark:text-white">
                      &#8358;{order?.totalAmount?.toFixed(2)}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
