<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\DeviceController;
use App\Http\Controllers\Api\DeviceTypeController;
use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\SessionController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\CustomerDashboardController;
use App\Http\Controllers\Api\CafeDashboardController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\OccupancyController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\LoyaltyRewardController;
use App\Http\Controllers\Api\DeviceClientController;
use App\Http\Controllers\Api\StaffController;
use Illuminate\Support\Facades\Route;

// ── Public: tanpa perlu login ──
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/public/devices', [DeviceController::class, 'index']);
Route::get('/public/devices/{device}', [DeviceController::class, 'show']);
Route::get('/public/games', [GameController::class, 'index']);
Route::get('/public/games/{game}', [GameController::class, 'show']);
Route::get('/public/products', [ProductController::class, 'index']);
Route::get('/public/reviews', [RatingController::class, 'recent']);
Route::get('/public/occupancy-stats', [OccupancyController::class, 'stats']);

// ── PC Client (Smart Lock): autentikasi pakai token device, bukan login user ──
Route::middleware('device.client')->group(function () {
    Route::get('/client/status', [DeviceClientController::class, 'status']);
});

// ── Wajib login (semua role) ──
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/profile', [AuthController::class, 'updateProfile']);
    Route::get('/my-dashboard', [CustomerDashboardController::class, 'index']);

    // Device & Game Catalog
    Route::get('/device-types', [DeviceTypeController::class, 'index']);
    Route::get('/devices', [DeviceController::class, 'index']);
    Route::get('/devices/{device}', [DeviceController::class, 'show']);
    Route::get('/games', [GameController::class, 'index']);
    Route::get('/games/{game}', [GameController::class, 'show']);

    // Booking
    Route::get('/devices/{device}/availability', [BookingController::class, 'availability']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);
    Route::patch('/bookings/{booking}/status', [BookingController::class, 'updateStatus']);
    Route::delete('/bookings/{booking}', [BookingController::class, 'destroy']);

    // Session
    Route::get('/sessions', [SessionController::class, 'index']);

    // Product Catalog
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);

    // Order
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);

    // Transaction
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show']);

    Route::post('/ratings', [RatingController::class, 'store']);

    Route::get('/feedback', [FeedbackController::class, 'index']);
    Route::post('/feedback', [FeedbackController::class, 'store']);

    Route::get('/my-rewards', [LoyaltyRewardController::class, 'index']);
    Route::post('/rewards/{reward}/choose', [LoyaltyRewardController::class, 'choose']);


    // ── Khusus OWNER & ADMIN ──
    Route::middleware('role:OWNER,ADMIN')->group(function () {
        Route::post('/devices', [DeviceController::class, 'store']);
        Route::put('/devices/{device}', [DeviceController::class, 'update']);
        Route::patch('/devices/{device}/status', [DeviceController::class, 'updateStatus']);
        Route::post('/devices/{device}/games', [DeviceController::class, 'syncGames']);
        Route::delete('/devices/{device}', [DeviceController::class, 'destroy']);
        Route::post('/devices/{device}/client-token', [DeviceController::class, 'regenerateClientToken']);

        Route::post('/games', [GameController::class, 'store']);
        Route::put('/games/{game}', [GameController::class, 'update']);
        Route::delete('/games/{game}', [GameController::class, 'destroy']);

        Route::get('/users', [UserController::class, 'index']);
        Route::get('/sessions/active', [SessionController::class, 'active']);
        Route::post('/sessions/start', [SessionController::class, 'start']);
        Route::post('/sessions/{session}/extend', [SessionController::class, 'extend']);
        Route::post('/sessions/{session}/end', [SessionController::class, 'end']);

        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

        Route::get('/transactions-checkoutable', [TransactionController::class, 'checkoutable']);
        Route::post('/sessions/{session}/checkout', [TransactionController::class, 'checkoutSession']);
        Route::post('/orders-checkout', [TransactionController::class, 'checkoutOrders']);
        Route::post('/transactions/{transaction}/pay', [TransactionController::class, 'pay']);
        Route::post('/transactions/{transaction}/archive', [TransactionController::class, 'archive']);
        Route::post('/transactions/{transaction}/unarchive', [TransactionController::class, 'unarchive']);
        Route::post('/transactions/{transaction}/hide', [TransactionController::class, 'hide']);

        Route::get('/dashboard', [DashboardController::class, 'index']);

        Route::patch('/feedback/{feedback}', [FeedbackController::class, 'updateStatus']);

        Route::get('/admin/loyalty-rewards', [LoyaltyRewardController::class, 'adminIndex']);

        // ── Khusus OWNER ──
        Route::middleware('role:OWNER')->group(function () {
            Route::get('/staff', [StaffController::class, 'index']);
            Route::post('/staff', [StaffController::class, 'store']);
            Route::put('/staff/{staff}', [StaffController::class, 'update']);
            Route::patch('/staff/{staff}/status', [StaffController::class, 'toggleStatus']);
            Route::get('/reports/revenue', [ReportController::class, 'revenue']);
            Route::get('/reports/gaming', [ReportController::class, 'gaming']);
            Route::get('/reports/food', [ReportController::class, 'food']);
            Route::get('/reports/inventory', [ReportController::class, 'inventory']);
        });
    });

    // ── Khusus OWNER, ADMIN, STAFF_CAFE ──
    Route::middleware('role:OWNER,ADMIN,STAFF_CAFE')->group(function () {
        Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
        Route::get('/cafe-dashboard', [CafeDashboardController::class, 'index']);

        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::post('/products/{product}/adjust-stock', [ProductController::class, 'adjustStock']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    });
});