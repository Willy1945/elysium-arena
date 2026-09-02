import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import DevicesPage from '../features/devices/DevicesPage';
import ProtectedRoute from './ProtectedRoute';
import GamesPage from '../features/games/GamesPage';
import DeviceDetailPage from '../features/devices/DeviceDetailPage';
import GameDetailPage from '../features/games/GameDetailPage';
import BookingFormPage from '../features/booking/BookingFormPage';
import BookingsListPage from '../features/booking/BookingsListPage';
import SessionsPage from '../features/sessions/SessionsPage';
import ProductsPage from '../features/products/ProductsPage';
import OrdersPage from '../features/orders/OrdersPage';
import NewOrderPage from '../features/orders/NewOrderPage';
import TransactionsPage from '../features/transactions/TransactionsPage';
import InvoicePage from '../features/transactions/InvoicePage';
import DashboardPage from '../features/dashboard/DashboardPage';
import ReportsPage from '../features/reports/ReportsPage';
import HomePage from '../features/public/HomePage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <div className="text-white p-8">Customer Dashboard (placeholder)</div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/devices"
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
              <DevicesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cafe/dashboard"
          element={
            <ProtectedRoute allowedRoles={['STAFF_CAFE']}>
              <div className="text-white p-8">Cafe Dashboard (placeholder)</div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/games"
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
              <GamesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/devices/:id"
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
              <DeviceDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/games/:id"
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
              <GameDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
              <BookingsListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings/new/:deviceId"
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
              <BookingFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/sessions"
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
              <SessionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
              <ProductsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'ADMIN', 'STAFF_CAFE']}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/new"
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'ADMIN', 'STAFF_CAFE']}>
              <NewOrderPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/transactions"
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
              <TransactionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/transactions/:id"
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'ADMIN']}>
              <InvoicePage />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<div className="text-white p-8">403 - Tidak ada akses</div>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>

  );
}