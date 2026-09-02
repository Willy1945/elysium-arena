<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DeviceTypeResource;
use App\Models\DeviceType;

class DeviceTypeController extends Controller
{
    public function index()
    {
        return DeviceTypeResource::collection(DeviceType::orderBy('name')->get());
    }
}