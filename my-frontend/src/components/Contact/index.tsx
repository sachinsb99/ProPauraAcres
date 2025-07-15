"use client";
import React, { useState, useCallback } from 'react';
import { Home, Send, CheckCircle, AlertCircle, Mail, Phone, User, MessageSquare, Star, Shield, Clock } from 'lucide-react';
// import { apiService } from '@/lib/api';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface ValidationErrors {
  [key: string]: string[] | undefined;
}

type SubmitStatus = 'success' | 'error' | 'validation_error' | null;

// You'll need to import your API service
// import { api } from './path/to/your/api';
import { apiService } from '@/lib/api';

const HomeEnquiry: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = useCallback((data: FormData): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!data.name.trim()) {
      newErrors.name = ['Name is required'];
    } else if (data.name.trim().length < 2) {
      newErrors.name = ['Name must be at least 2 characters long'];
    }

    if (!data.email.trim()) {
      newErrors.email = ['Email is required'];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = ['Please enter a valid email address'];
    }

    if (data.phone.trim() && !/^[\+]?[1-9][\d]{0,15}$/.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = ['Please enter a valid phone number'];
    }

    if (!data.message.trim()) {
      newErrors.message = ['Message is required'];
    } else if (data.message.trim().length < 10) {
      newErrors.message = ['Message must be at least 10 characters long'];
    }

    return newErrors;
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    if (submitStatus) {
      setSubmitStatus(null);
    }
  }, [errors, submitStatus]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrors({});

    const newErrors = validateForm(formData);
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      setSubmitStatus('validation_error');
      return;
    }

    try {
      // REPLACE THIS SECTION WITH YOUR ACTUAL API CALL
      // Example of how to call your API:
      
      // Prepare the data for your API
      const enquiryData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim()
      };

      // Call your actual API
      const response = await apiService.submitEnquiry(enquiryData);
      
      // For now, I'll keep the simulation but add a comment
      // REMOVE THIS SIMULATION AND UNCOMMENT THE API CALL ABOVE
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Only set success if API call succeeds
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error: any) {
      console.error('Error submitting enquiry:', error);
      setSubmitStatus('error');
      
      // Handle specific API errors if needed
      if (error.response?.status === 400) {
        // Handle validation errors from API
        if (error.response.data?.errors) {
          setErrors(error.response.data.errors);
          setSubmitStatus('validation_error');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  const getFieldError = useCallback((fieldName: string): string | null => {
    return errors[fieldName] ? errors[fieldName]![0] : null;
  }, [errors]);

  return (
    <section className="min-h-screen py-12 px-4 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-300/10 to-blue-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full blur-lg opacity-70 animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full shadow-2xl">
                <Home className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                One Message Away
              </h1>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
                <span className="text-sm text-gray-600 ml-2">Trusted by 10,000+ clients</span>
              </div>
            </div>
          </div>
          <p className="text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed font-light">
            Your perfect home is just one message away. Tell us what you're looking for and we'll do the rest.
          </p>
        </div>

        {/* Main Container with Equal Heights */}
        <div className="grid lg:grid-cols-3 gap-8 lg:items-stretch">
          {/* Trust Indicators - Side Panel */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 flex-1 flex flex-col mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Why Choose Us?</h3>
              <div className="space-y-4 flex-1">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Clock className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">24H Response</h4>
                    <p className="text-sm text-gray-600">Get personalized recommendations within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">100% Secure</h4>
                    <p className="text-sm text-gray-600">Your information is protected and never shared</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">No Commitment</h4>
                    <p className="text-sm text-gray-600">Free consultation with no strings attached</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Privacy Protected</h4>
                    <p className="text-sm text-gray-600">SSL encrypted and GDPR compliant. Your data stays secure.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50/70 to-blue-50/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
              <h3 className="text-lg font-bold text-gray-900 mb-3">What Our Clients Say</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic">
                  "Found my dream home within a week! The team was incredibly helpful and professional."
                </p>
                <p className="text-xs text-gray-500">- Sarah M.</p>
              </div>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="lg:col-span-2 flex">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30 w-full flex flex-col">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Send Your Home Enquiry
                </h2>
                <p className="text-gray-600 text-lg">
                  Quick and simple - we'll get back to you within 24 hours.
                </p>
              </div>

              <div className="space-y-6 flex-1">
                {/* Name Field */}
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className={`w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-sm border rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:bg-white/90 hover:shadow-lg ${
                        getFieldError('name') ? 'border-red-400 bg-red-50/70' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {getFieldError('name') && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {getFieldError('name')}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className={`w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-sm border rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:bg-white/90 hover:shadow-lg ${
                        getFieldError('email') ? 'border-red-400 bg-red-50/70' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {getFieldError('email') && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {getFieldError('email')}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="group">
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-gray-500 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className={`w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-sm border rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:bg-white/90 hover:shadow-lg ${
                        getFieldError('phone') ? 'border-red-400 bg-red-50/70' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {getFieldError('phone') && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {getFieldError('phone')}
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div className="group">
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Tell Us What You're Looking For *
                  </label>
                  <div className="relative">
                    <div className="absolute top-4 left-4 flex items-start pointer-events-none">
                      <MessageSquare className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Describe your dream home... (e.g., 3 bedrooms, near schools, budget $500k, downtown area, etc.)"
                      className={`w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-sm border rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:bg-white/90 hover:shadow-lg resize-none ${
                        getFieldError('message') ? 'border-red-400 bg-red-50/70' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {getFieldError('message') && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {getFieldError('message')}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-white font-bold py-5 px-8 rounded-2xl hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 flex items-center justify-center gap-3 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>Sending Your Enquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6" />
                        Send My Enquiry
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mt-8 p-6 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/50 rounded-2xl flex items-start gap-4 shadow-lg" role="alert">
                  <div className="p-2 bg-emerald-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-emerald-800 font-bold text-lg">
                      Enquiry sent successfully!
                    </p>
                    <p className="text-emerald-700 mt-1">
                      We'll contact you within 24 hours with personalized recommendations.
                    </p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mt-8 p-6 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl flex items-start gap-4 shadow-lg" role="alert">
                  <div className="p-2 bg-red-100 rounded-full">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-red-800 font-bold text-lg">
                      Something went wrong
                    </p>
                    <p className="text-red-700 mt-1">
                      Please try again or contact us directly if the problem persists.
                    </p>
                  </div>
                </div>
              )}

              {submitStatus === 'validation_error' && (
                <div className="mt-8 p-6 bg-yellow-50/80 backdrop-blur-sm border border-yellow-200/50 rounded-2xl flex items-start gap-4 shadow-lg" role="alert">
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-yellow-800 font-bold text-lg">
                      Please check your information
                    </p>
                    <p className="text-yellow-700 mt-1">
                      Review the highlighted fields and try again.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeEnquiry;