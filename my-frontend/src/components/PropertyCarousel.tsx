'use client';
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Property {
  image: string;
  title: string;
  location: string;
  type: string;
  price: string;
  beds?: number;
  baths?: number;
  area: number;
  added: string;
}

const properties: Property[] = [
  {
    image: '/images/home1.jpg',
    title: '05 BHK Independent Home For Sale In Thyagaraja Nagar, Bangalore',
    location: 'Thyagaraja Nagar, Bangalore South',
    type: 'Independent Homes',
    price: '₹70,000,000',
    beds: 5,
    baths: 5,
    area: 2500,
    added: 'August 20, 2024'
  },
  {
    image: '/images/apartment1.jpg',
    title: '3BHK Flat for Sale in Assetz 63 Degree East',
    location: 'Kodati, Bangalore',
    type: 'Apartments',
    price: '₹19,000,000',
    beds: 3,
    baths: 3,
    area: 1663,
    added: 'April 17, 2025'
  },
  {
    image: '/images/plot1.jpg',
    title: 'Southwest-Facing Corner Plot for Sale – AECS Layout, Singasandra',
    location: 'Singasandra',
    type: 'Plots',
    price: '₹34,200,000',
    area: 1900,
    added: 'May 19, 2025'
  },
  {
    image: '/images/home2.jpg',
    title: '4BHK Duplex in HSR Layout, Bangalore',
    location: 'HSR Layout, Bangalore',
    type: 'Independent Homes',
    price: '₹52,000,000',
    beds: 4,
    baths: 4,
    area: 3000,
    added: 'June 12, 2025'
  },
  {
    image: '/images/apartment2.jpg',
    title: '2BHK Apartment in Whitefield',
    location: 'Whitefield, Bangalore',
    type: 'Apartments',
    price: '₹12,500,000',
    beds: 2,
    baths: 2,
    area: 1100,
    added: 'May 25, 2025'
  }
];

const PropertyCarousel: React.FC = () => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="px-6 py-8">
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        loop
        modules={[Navigation, Autoplay, Pagination]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current
        }}
        onBeforeInit={(swiper) => {
          if (typeof swiper.params.navigation !== 'boolean') {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
        pagination={{ clickable: true, el: '.custom-pagination' }}
      >
        {properties.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className="rounded-lg shadow-md border hover:shadow-xl transition overflow-hidden">
              <img src={item.image} alt="property" className="h-52 w-full object-cover" />
              <div className="p-4">
                <h2 className="font-semibold text-lg mb-1">{item.title}</h2>
                <p className="text-gray-500 text-sm mb-2">{item.location}</p>
                <p className="text-sm text-blue-500">{item.type}</p>
                <p className="text-xl font-bold mt-2">{item.price}</p>
                <div className="flex items-center text-sm text-gray-600 mt-2 space-x-4">
                  {item.beds && <span>🛏 {item.beds}</span>}
                  {item.baths && <span>🛁 {item.baths}</span>}
                  <span>📐 {item.area} sqft</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Added: {item.added}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation and pagination below the slider */}
      <div className="flex items-center justify-center mt-6 space-x-6">
        <button
          ref={prevRef}
          className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition"
        >
          ◀
        </button>

        <div className="custom-pagination flex space-x-2"></div>

        <button
          ref={nextRef}
          className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default PropertyCarousel;
