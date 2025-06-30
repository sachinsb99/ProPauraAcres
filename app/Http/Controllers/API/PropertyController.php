<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class PropertyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Property::with(['category:id,name', 'images:id,property_id,image_path'])
            ->select('id', 'name', 'location', 'category_id', 'price_per_square_feet', 'status', 'is_featured', 'main_image', 'created_at');

        // Filters
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('is_featured')) {
            $query->where('is_featured', $request->boolean('is_featured'));
        }

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('location', 'like', '%' . $request->search . '%');
            });
        }

        $properties = $query->latest()->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $properties
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'location' => 'required|string|max:255',
            'address' => 'nullable|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'price_per_square_feet' => 'required|numeric|min:0',
            'total_area' => 'nullable|numeric|min:0',
            'built_area' => 'nullable|numeric|min:0',
            'bedrooms' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'parking_spaces' => 'nullable|integer|min:0',
            'year_built' => 'nullable|integer|min:1800|max:' . (date('Y') + 5),
            'main_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'amenities' => 'nullable|array',
            'status' => 'required|in:available,sold,rented,pending',
            'is_featured' => 'boolean',
            'is_active' => 'boolean'
        ]);

        DB::beginTransaction();
        try {
            $propertyData = $request->except(['main_image', 'images']);

            // Handle main image upload
            if ($request->hasFile('main_image')) {
                $mainImagePath = $request->file('main_image')->store('properties/main', 'public');
                $propertyData['main_image'] = $mainImagePath;
            }

            $property = Property::create($propertyData);

            // Handle additional images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $imagePath = $image->store('properties/gallery', 'public');
                    PropertyImage::create([
                        'property_id' => $property->id,
                        'image_path' => $imagePath,
                        'sort_order' => $index
                    ]);
                }
            }

            DB::commit();

            $property->load(['category', 'images']);

            return response()->json([
                'success' => true,
                'message' => 'Property created successfully',
                'data' => $property
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Error creating property: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(Property $property): JsonResponse
    {
        $property->load(['category', 'images']);

        return response()->json([
            'success' => true,
            'data' => $property
        ]);
    }

    public function update(Request $request, Property $property): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'location' => 'required|string|max:255',
            'address' => 'nullable|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'price_per_square_feet' => 'required|numeric|min:0',
            'total_area' => 'nullable|numeric|min:0',
            'built_area' => 'nullable|numeric|min:0',
            'bedrooms' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'parking_spaces' => 'nullable|integer|min:0',
            'year_built' => 'nullable|integer|min:1800|max:' . (date('Y') + 5),
            'main_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'amenities' => 'nullable|array',
            'status' => 'required|in:available,sold,rented,pending',
            'is_featured' => 'boolean',
            'is_active' => 'boolean'
        ]);

        DB::beginTransaction();
        try {
            $propertyData = $request->except(['main_image', 'images']);

            // Handle main image upload
            if ($request->hasFile('main_image')) {
                // Delete old main image
                if ($property->main_image) {
                    Storage::disk('public')->delete($property->main_image);
                }
                $mainImagePath = $request->file('main_image')->store('properties/main', 'public');
                $propertyData['main_image'] = $mainImagePath;
            }

            $property->update($propertyData);

            DB::commit();

            $property->load(['category', 'images']);

            return response()->json([
                'success' => true,
                'message' => 'Property updated successfully',
                'data' => $property
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Error updating property: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Property $property): JsonResponse
    {
        DB::beginTransaction();
        try {
            // Delete main image
            if ($property->main_image) {
                Storage::disk('public')->delete($property->main_image);
            }

            // Delete gallery images
            foreach ($property->images as $image) {
                Storage::disk('public')->delete($image->image_path);
            }

            $property->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Property deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Error deleting property: ' . $e->getMessage()
            ], 500);
        }
    }
}