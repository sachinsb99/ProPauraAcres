'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { apiService } from '@/lib/api';

// Types based on your database structure
interface Property {
  id: number;
  name: string;
  slug: string;
  description: string;
  property_category_id: number;
  location: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  price_per_square_feet: number;
  total_area?: number;
  built_area?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking_spaces?: number;
  year_built?: number;
  main_image?: string;
  amenities?: string; // JSON string
  status: 'available' | 'sold' | 'rented' | 'pending';
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: {
    id: number;
    name: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: Property[];
  message?: string;
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

const PropertyCarousel: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        console.log('Starting to fetch properties...');
        
        const response = await apiService.getProperties();
        console.log('Fetched properties:', response);
        
        // Handle different response structures
        if (response.success && response.data) {
          setProperties(response.data);
        } else if (Array.isArray(response.data)) {
          setProperties(response.data);
        } else {
          // Handle Laravel Eloquent Collection response structure
          if (Array.isArray(response) && response.length > 0) {
            const collection = response[0]['Illuminate\\Database\\Eloquent\\Collection'];
            if (Array.isArray(collection)) {
              setProperties(collection);
            } else {
              setProperties([]);
            }
          } else {
            setProperties([]);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching properties:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load properties';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const formatPrice = (pricePerSqft: number, totalArea?: number) => {
    if (totalArea) {
      const totalPrice = pricePerSqft * totalArea;
      return `₹${totalPrice.toLocaleString('en-IN')}`;
    }
    return `₹${pricePerSqft.toLocaleString('en-IN')}/sqft`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { bg: 'bg-green-500', text: 'Available' },
      sold: { bg: 'bg-red-500', text: 'Sold' },
      rented: { bg: 'bg-blue-500', text: 'Rented' },
      pending: { bg: 'bg-yellow-500', text: 'Pending' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.available;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${config.bg}`}>
        {config.text}
      </span>
    );
  };

  // Function to get the correct image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/images/placeholder-property.jpg';
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Construct the full URL for your Laravel storage
    // Adjust this base URL to match your Laravel storage configuration
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return `${baseUrl}/storage/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 py-8">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-lg font-medium">Error loading properties</p>
            <p className="text-sm text-gray-600 mt-2">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="px-4 sm:px-6 py-8">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">No properties found</p>
          <p className="text-sm">Check back later for new listings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Newest Properties Around You
        </h2>
        <p className="text-gray-600">Discover the latest property listings in your area</p>
      </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        loop={properties.length > 1}
        modules={[Navigation, Autoplay, Pagination]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current
        }}
        onBeforeInit={(swiper) => {
          if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        pagination={{ 
          clickable: true, 
          el: '.custom-pagination',
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active'
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1280: {
            slidesPerView: 3,
            spaceBetween: 32,
          }
        }}
        className="pb-4"
      >
        {properties.map((property) => (
          <SwiperSlide key={property.id}>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group">
              {/* Property Image */}
              <div className="relative h-48 sm:h-52 overflow-hidden">
                <img 
                  src={getImageUrl(property.main_image || '')} 
                  alt={property.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.currentTarget.src = '/images/placeholder-property.jpg';
                  }}
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {property.is_featured && (
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  )}
                  {getStatusBadge(property.status)}
                </div>
                {property.total_area && (
                  <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
                    📐 {property.total_area} sqft
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="p-4 sm:p-5">
                <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {property.name}
                </h3>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm line-clamp-1">{property.location}</span>
                </div>

                {property.category && (
                  <p className="text-sm text-blue-600 font-medium mb-2">
                    {property.category.name}
                  </p>
                )}

                <div className="text-xl font-bold text-gray-900 mb-3">
                  {formatPrice(property.price_per_square_feet, property.total_area)}
                </div>

                {/* Property Features */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-4">
                    {property.bedrooms && (
                      <span className="flex items-center">
                        🛏️ {property.bedrooms}
                      </span>
                    )}
                    {property.bathrooms && (
                      <span className="flex items-center">
                        🛁 {property.bathrooms}
                      </span>
                    )}
                    {property.parking_spaces && (
                      <span className="flex items-center">
                        🚗 {property.parking_spaces}
                      </span>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span>Added: {formatDate(property.created_at)}</span>
                  {property.year_built && (
                    <span>Built: {property.year_built}</span>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation and Pagination */}
      <div className="flex items-center justify-center mt-8 space-x-6">
        <button
          ref={prevRef}
          className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={properties.length <= 1}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="custom-pagination flex space-x-2"></div>

        <button
          ref={nextRef}
          className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={properties.length <= 1}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Custom Pagination Styles */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #d1d5db;
          opacity: 1;
          transition: all 0.3s ease;
        }
        
        .swiper-pagination-bullet-active {
          background: #3b82f6;
          transform: scale(1.2);
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default PropertyCarousel;