<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return CategoryResource::collection(Category::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:255', 'unique:categories,name']]);
        $category = Category::create($data);

        return new CategoryResource($category);
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:255', 'unique:categories,name,' . $category->id]]);
        $category->update($data);

        return new CategoryResource($category);
    }

    public function destroy(Category $category)
    {
        if ($category->products()->exists()) {
            return response()->json(['message' => 'Kategori tidak bisa dihapus karena masih memiliki produk.'], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Kategori berhasil dihapus.']);
    }
}