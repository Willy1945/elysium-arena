<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\AdjustStockRequest;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\InventoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    public function __construct(protected InventoryService $inventoryService)
    {
    }

    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if (! $request->boolean('include_inactive')) {
            $query->where('is_active', true);
        }

        return ProductResource::collection($query->orderBy('name')->get());
    }

    public function show(Product $product)
    {
        return new ProductResource($product->load('category'));
    }

    public function store(StoreProductRequest $request)
    {
        $data = $request->only(['category_id', 'name', 'price', 'stock', 'minimum_stock', 'description']);
        $data['is_active'] = $request->boolean('is_active', true);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($data);

        return new ProductResource($product->load('category'));
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->only(['category_id', 'name', 'price', 'minimum_stock', 'description']);

        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($data);

        return new ProductResource($product->load('category'));
    }

    public function adjustStock(AdjustStockRequest $request, Product $product)
    {
        try {
            $product = $this->inventoryService->adjustStock(
                $product,
                $request->type,
                $request->quantity,
                $request->reason,
                $request->user()->id
            );
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->getMessage() ?: 'Gagal menyesuaikan stok.', 'errors' => $e->errors()], 422);
        }

        return new ProductResource($product->load('category'));
    }

    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json(['message' => 'Produk berhasil dihapus.']);
    }
}