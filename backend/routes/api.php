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
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // ── Device & Game Catalog: bisa dilihat semua role yang login ──
    Route::get('/device-types', [DeviceTypeController::class, 'index']);
    Route::get('/devices', [DeviceController::class, 'index']);
    Route::get('/devices/{device}', [DeviceController::class, 'show']);
    Route::get('/games', [GameController::class, 'index']);
    Route::get('/games/{game}', [GameController::class, 'show']);

    // ── Management: khusus OWNER & ADMIN ──
    Route::middleware('role:OWNER,ADMIN')->group(function () {
        Route::post('/devices', [DeviceController::class, 'store']);
        Route::put('/devices/{device}', [DeviceController::class, 'update']); // POST + _method karena ada file upload
        Route::patch('/devices/{device}/status', [DeviceController::class, 'updateStatus']);
        Route::post('/devices/{device}/games', [DeviceController::class, 'syncGames']);
        Route::delete('/devices/{device}', [DeviceController::class, 'destroy']);

        Route::post('/games', [GameController::class, 'store']);
        Route::put('/games/{game}', [GameController::class, 'update']);
        Route::delete('/games/{game}', [GameController::class, 'destroy']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        // ...route yang sudah ada...

        // ── Booking: semua role yang login bisa akses (customer lihat punya sendiri, admin lihat semua) ──
        Route::get('/devices/{device}/availability', [BookingController::class, 'availability']);
        Route::get('/bookings', [BookingController::class, 'index']);
        Route::post('/bookings', [BookingController::class, 'store']);
        Route::get('/bookings/{booking}', [BookingController::class, 'show']);
        Route::patch('/bookings/{booking}/status', [BookingController::class, 'updateStatus']);
        Route::delete('/bookings/{booking}', [BookingController::class, 'destroy']);

        // ...grup role:OWNER,ADMIN yang sudah ada...
    });

    Route::middleware('auth:sanctum')->group(function () {
        // ...route yang sudah ada...

        Route::get('/sessions', [SessionController::class, 'index']);

        Route::middleware('role:OWNER,ADMIN')->group(function () {
            // ...route device/game yang sudah ada...

            Route::get('/users', [UserController::class, 'index']);
            Route::get('/sessions/active', [SessionController::class, 'active']);
            Route::post('/sessions/start', [SessionController::class, 'start']);
            Route::post('/sessions/{session}/extend', [SessionController::class, 'extend']);
            Route::post('/sessions/{session}/end', [SessionController::class, 'end']);
        });
    });

    Route::middleware('auth:sanctum')->group(function () {
        // ...route yang sudah ada...

        // ── Product Catalog: bisa dilihat semua role ──
        Route::get('/categories', [CategoryController::class, 'index']);
        Route::get('/products', [ProductController::class, 'index']);
        Route::get('/products/{product}', [ProductController::class, 'show']);

        Route::middleware('role:OWNER,ADMIN')->group(function () {
            // ...route device/game/session yang sudah ada...

            Route::post('/categories', [CategoryController::class, 'store']);
            Route::put('/categories/{category}', [CategoryController::class, 'update']);
            Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

            Route::post('/products', [ProductController::class, 'store']);
            Route::put('/products/{product}', [ProductController::class, 'update']);
            Route::post('/products/{product}/adjust-stock', [ProductController::class, 'adjustStock']);
            Route::delete('/products/{product}', [ProductController::class, 'destroy']);
        });
    });

    Route::middleware('auth:sanctum')->group(function () {
        // ...route yang sudah ada...

        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);

        Route::middleware('role:OWNER,ADMIN,STAFF_CAFE')->group(function () {
            Route::post('/orders', [OrderController::class, 'store']);
            Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);
        });
    });

    Route::middleware('auth:sanctum')->group(function () {
        // ...route yang sudah ada...

        Route::get('/transactions', [TransactionController::class, 'index']);
        Route::get('/transactions/{transaction}', [TransactionController::class, 'show']);

        Route::middleware('role:OWNER,ADMIN')->group(function () {
            // ...route lain yang sudah ada...

            Route::get('/transactions-checkoutable', [TransactionController::class, 'checkoutable']);
            Route::post('/sessions/{session}/checkout', [TransactionController::class, 'checkoutSession']);
            Route::post('/orders-checkout', [TransactionController::class, 'checkoutOrders']);
            Route::post('/transactions/{transaction}/pay', [TransactionController::class, 'pay']);
            Route::post('/transactions/{transaction}/archive', [TransactionController::class, 'archive']);
            Route::post('/transactions/{transaction}/unarchive', [TransactionController::class, 'unarchive']);
        });
    });

    Route::middleware('auth:sanctum')->group(function () {
        // ...route yang sudah ada...

        Route::middleware('role:OWNER,ADMIN')->group(function () {
            // ...route lain yang sudah ada...

            Route::get('/dashboard', [DashboardController::class, 'index']);

            Route::middleware('role:OWNER')->group(function () {
                Route::get('/reports/revenue', [ReportController::class, 'revenue']);
                Route::get('/reports/gaming', [ReportController::class, 'gaming']);
                Route::get('/reports/food', [ReportController::class, 'food']);
                Route::get('/reports/inventory', [ReportController::class, 'inventory']);
            });
        });
    });
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ── Public browsing: tanpa perlu login ──
Route::get('/public/devices', [DeviceController::class, 'index']);
Route::get('/public/devices/{device}', [DeviceController::class, 'show']);
Route::get('/public/games', [GameController::class, 'index']);