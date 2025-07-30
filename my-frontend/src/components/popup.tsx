"use client"

import { useState, useEffect } from "react";
import { FaPhone, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { submitPropertyEnquiry } from "@/lib/api";

interface PropertyEnquiryModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  autoOpen?: boolean;
  autoOpenDelay?: number;
}

const PropertyEnquiryModal = ({ 
  isOpen: controlledIsOpen, 
  onClose: controlledOnClose,
  autoOpen = true,
  autoOpenDelay = 10000 // 10 seconds in milliseconds
}: PropertyEnquiryModalProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const onClose = controlledOnClose || (() => setInternalIsOpen(false));

  const images = [
    "https://images.unsplash.com/photo-1613977257363-707ba9348227",
    "https://images.unsplash.com/photo-1613545325278-f24b0cae1224",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
  ];

  // Auto-open functionality
  useEffect(() => {
    if (autoOpen && !hasAutoOpened && controlledIsOpen === undefined) {
      const timer = setTimeout(() => {
        setInternalIsOpen(true);
        setHasAutoOpened(true);
      }, autoOpenDelay);

      return () => clearTimeout(timer);
    }
  }, [autoOpen, autoOpenDelay, hasAutoOpened, controlledIsOpen]);

  // Image carousel auto-advance
  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isOpen, images.length]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      propertyType: ""
    },
    validationSchema: Yup.object({
      fullName: Yup.string().min(2, "Too Short").required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      phone: Yup.string().matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").required("Required"),
      propertyType: Yup.string().required("Required")
    }),
    onSubmit: (values) => {
      console.log(values);
        submitPropertyEnquiry(values)
        .then(response => {
        console.log("Success", response);
        alert(response.message); // optional: show success
        onClose?.();
        })
        .catch(error => {
        console.error("Enquiry submission failed", error);
        alert("Submission failed. Please try again.");
        });
    }
  });

  if (!isOpen) return null;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-6xl mx-4 bg-white rounded-xl shadow-2xl overflow-hidden animate-slideUp">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Close modal"
        >
          <FaTimes size={24} />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Image Carousel */}
          <div className="relative w-full md:w-1/2 h-64 md:h-auto">
            <div className="relative h-full">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                aria-label="Previous slide"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                aria-label="Next slide"
              >
                <FaChevronRight />
              </button>
              
              {/* Slide indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide ? "bg-white" : "bg-white/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="w-full md:w-1/2 p-8 bg-gradient-to-br from-gray-50 to-white">
            <div className="absolute top-4 right-20">
              <button
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors"
                aria-label="Quick call"
                onClick={() => window.open('tel:+917339047488', '_self')}
              >
                <FaPhone /> Quick Call
              </button>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Dream Property Awaits</h2>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  id="fullName"
                  placeholder="Enter your full name"
                  {...formik.getFieldProps("fullName")}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.fullName}</div>
                )}
              </div>

              <div>
                <input
                  type="email"
                  id="email"
                  placeholder="Your professional email"
                  {...formik.getFieldProps("email")}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.email}</div>
                )}
              </div>

              <div>
                <input
                  type="tel"
                  id="phone"
                  placeholder="+91 9876xxxx98"
                  {...formik.getFieldProps("phone")}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.phone}</div>
                )}
              </div>

              <div>
                <select
                  id="propertyType"
                  {...formik.getFieldProps("propertyType")}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">Select Property Type</option>
                  <option value="home">Home</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                </select>
                {formik.touched.propertyType && formik.errors.propertyType && (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.propertyType}</div>
                )}
              </div>

              {/* <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Request Property Details
              </button> */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                disabled={formik.isSubmitting}
                >
                {formik.isSubmitting ? "Submitting..." : "Request Property Details"}
                </button>

            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PropertyEnquiryModal;