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
import UserDashboard from './screens/user/UserDashboard'
import { AdminDashboard } from './screens/admin/AdminDashboard'
import ForgotPassword from './screens/auth/ForgotPassword'
import ResetPassword from './screens/auth/ResetPassword'
import OauthSuccess from './screens/auth/OauthSuccess'

import OverviewPage from "./screens/admin/pages/OverviewPage";
import ProductsPage from "./screens/admin/pages/products/ProductsPage"
import AddProductPage from "./screens/admin/pages/products/AddProductPage"
import UsersPage from "./screens/admin/pages/UsersPage"
import SalesPage from "./screens/admin/pages/SalesPage"
import OrdersPage from "./screens/admin/pages/OrdersPage"
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


function App() {
   const { checkAuth, checkingAuth } = useAuthStore();
   useEffect(() => {
      checkAuth();
   },[checkAuth]) 
   
  if(checkingAuth) return <Spinner/>
  
  return (
    <div className="relative min-h-screen overflow-hidden text-white bg-gray-900 font-nunitoSans">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>
      <Navbar />

      <div className="relative z-50 pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetails/>}/>

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
            path="/user/dashboard"
            element={
              <UserRoute>
                <UserDashboard />
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
      </div>

      <Toaster />
    </div>
  );
}

export default App
