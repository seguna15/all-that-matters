import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './screens/auth/Login'
import { FloatingShape, Navbar, Spinner } from './components'
import HomePage from './screens/home/HomePage'
import Register from './screens/auth/Register'
import EmailVerification from './screens/auth/EmailVerification'
import {Toaster} from "react-hot-toast"
import { useAuthStore } from './store/authStore'
import { RedirectAuthenticatedUser, UserRoute, AdminRoute } from './Routes'
import { AdminDashboard } from './screens/admin/AdminDashboard'
import ForgotPassword from './screens/auth/ForgotPassword'
import ResetPassword from './screens/auth/ResetPassword'
import OauthSuccess from './screens/auth/OauthSuccess'

import OverviewPage from "./screens/admin/pages/OverviewPage";
import ProductsPage from "./screens/admin/pages/products/ProductsPage"
import AddProductPage from "./screens/admin/pages/products/AddProductPage"
import UsersPage from "./screens/admin/pages/users/UsersPage"
import SalesPage from "./screens/admin/pages/SalesPage"
import OrdersPage from "./screens/admin/pages/orders/OrdersPage"
import AnalyticsPage from "./screens/admin/pages/AnalyticsPage";
import SettingsPage from "./screens/admin/pages/SettingsPage"
import CategoriesPage from './screens/admin/pages/categories/CategoriesPage'
import AddCategoryPage from './screens/admin/pages/categories/AddCategoryPage'
import UpdateProductsPage from './screens/admin/pages/products/UpdateProductPage'
import UpdateBrandPage from './screens/admin/pages/brands/UpdateBrandPage'
import AddBrandPage from './screens/admin/pages/brands/AddBrandPage'
import BrandsPage from './screens/admin/pages/brands/BrandsPage'
import UpdateCategoryPage from './screens/admin/pages/categories/UpdateCategoryPage'
import CategoryPage from './screens/category/CategoryPage'
import ProductDetails from './screens/products/ProductDetails'
import Cart from './screens/payment/Cart'
import { useCartsStore } from './store/cartsStore'
import CouponsPage from './screens/admin/pages/coupons/CouponPage'
import AddCouponPage from './screens/admin/pages/coupons/AddCouponPage'
import UpdateCouponPage from './screens/admin/pages/coupons/UpdateCouponPage'
import PurchaseSuccessPage from './screens/payment/PurchaseSuccessPage'
import PurchaseCancelPage from './screens/payment/PurchaseCancelPage'
import CheckOutPage from './screens/payment/CheckoutPage'
import AdminProductDetails from './screens/admin/pages/products/AdminProductDetails'
import OrderDetailsPage from './screens/admin/pages/orders/OrderDetails.page'
import Orders from './screens/user/Orders'
import CustomerOrderDetails from './screens/user/CustomerOrderDetails'


function App() {

   const { getCartItems } = useCartsStore();
   const {user} = useAuthStore()
   
   useEffect(() => {
    if(user !== null) {
      getCartItems();
    }
   }, [user, getCartItems]); 
   
  
  
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route
          path="/auth/oauth-success/:email"
          element={
            <RedirectAuthenticatedUser>
              <OauthSuccess />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/auth/login"
          element={
            <RedirectAuthenticatedUser>
              <Login />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/auth/register"
          element={
            <RedirectAuthenticatedUser>
              <Register />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/auth/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPassword />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/auth/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPassword />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/auth/verify-email"
          element={
            <RedirectAuthenticatedUser>
              <EmailVerification />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/orders"
          element={
            <UserRoute>
              <Orders />
            </UserRoute>
          }
        />
        <Route
          path="/order-detail/:id"
          element={
            <UserRoute>
              <CustomerOrderDetails />
            </UserRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <UserRoute>
              <Cart />
            </UserRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <UserRoute>
              <CheckOutPage />
            </UserRoute>
          }
        />
        <Route
          path="/payment-success"
          element={
            <UserRoute>
              <PurchaseSuccessPage />
            </UserRoute>
          }
        />
        <Route
          path="/payment-canceled"
          element={
            <UserRoute>
              <PurchaseCancelPage />
            </UserRoute>
          }
        />
        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        >
          <Route
            path=""
            element={
              <AdminRoute>
                <OverviewPage />
              </AdminRoute>
            }
          />

          <Route
            path="products"
            element={
              <AdminRoute>
                <ProductsPage />
              </AdminRoute>
            }
          />
          <Route
            path="add-product"
            element={
              <AdminRoute>
                <AddProductPage />
              </AdminRoute>
            }
          />
          <Route
            path="product-details/:id"
            element={
              <AdminRoute>
                <AdminProductDetails />
              </AdminRoute>
            }
          />
          <Route
            path="edit-product/:id"
            element={
              <AdminRoute>
                <UpdateProductsPage />
              </AdminRoute>
            }
          />

          <Route
            path="categories"
            element={
              <AdminRoute>
                <CategoriesPage />
              </AdminRoute>
            }
          />
          <Route
            path="add-category"
            element={
              <AdminRoute>
                <AddCategoryPage />
              </AdminRoute>
            }
          />
          <Route
            path="edit-category/:id"
            element={
              <AdminRoute>
                <UpdateCategoryPage />
              </AdminRoute>
            }
          />

          <Route
            path="coupons"
            element={
              <AdminRoute>
                <CouponsPage />
              </AdminRoute>
            }
          />
          <Route
            path="add-coupon"
            element={
              <AdminRoute>
                <AddCouponPage />
              </AdminRoute>
            }
          />
          <Route
            path="edit-coupon/:id"
            element={
              <AdminRoute>
                <UpdateCouponPage />
              </AdminRoute>
            }
          />

          <Route
            path="brands"
            element={
              <AdminRoute>
                <BrandsPage />
              </AdminRoute>
            }
          />
          <Route
            path="add-brand"
            element={
              <AdminRoute>
                <AddBrandPage />
              </AdminRoute>
            }
          />
          <Route
            path="edit-brand/:id"
            element={
              <AdminRoute>
                <UpdateBrandPage />
              </AdminRoute>
            }
          />

          <Route
            path="users"
            element={
              <AdminRoute>
                <UsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="sales"
            element={
              <AdminRoute>
                <SalesPage />
              </AdminRoute>
            }
          />
          <Route
            path="orders"
            element={
              <AdminRoute>
                <OrdersPage />
              </AdminRoute>
            }
          />
          <Route
            path="order-detail/:id"
            element={
              <AdminRoute>
                <OrderDetailsPage />
              </AdminRoute>
            }
          />
          <Route
            path="analytics"
            element={
              <AdminRoute>
                <AnalyticsPage />
              </AdminRoute>
            }
          />
          <Route
            path="settings"
            element={
              <AdminRoute>
                <SettingsPage />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>

      <Toaster />
    </>
  );
}

export default App
