import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true, margin: '0px 0px -100px 0px' },
};

interface FormData {
  name: string;
  phone: string;
  email: string;
  company: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  message?: string;
}

interface Service {
  title: string;
  description: string;
  image: string;
  details: {
    title: string;
    benefits: { title: string; description: string }[];
    services: { title: string; description: string }[];
  };
}

interface ContactSectionProps {
  formData: FormData;
  formErrors: FormErrors;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  showSuccessModal: boolean;
  selectedService: Service | null;
  setSelectedService: (service: Service | null) => void;
  setShowSuccessModal: (show: boolean) => void;
  isFieldValid: (fieldName: string) => boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function ContactSection({
  formData,
  formErrors,
  touched,
  isSubmitting,
  showSuccessModal,
  selectedService,
  setSelectedService,
  setShowSuccessModal,
  isFieldValid,
  handleInputChange,
  handleBlur,
  handleSubmit,
}: ContactSectionProps) {
  return (
    <section id="contact" className="py-16 md:py-24 lg:py-28 bg-white relative overflow-hidden">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column */}
          <motion.div {...fadeInUp}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              지금 어떤 고민이 있으신가요?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
              아직 방향이 명확하지 않아도 괜찮습니다.
              <br />
              광고, 콘텐츠, 운영 흐름까지
              <br />
              현재 고민하고 있는 부분을 함께 정리합니다.
            </p>

            <div className="space-y-4">
              {/* Email Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-300 bg-white"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">이메일</p>
                  <p className="text-gray-900 font-semibold">contact@newlinkcorp.kr</p>
                </div>
              </motion.div>

              {/* Phone Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-300 bg-white"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">전화</p>
                  <p className="text-gray-900 font-semibold">070-4156-3684</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: '0px 0px -100px 0px' }}
            className="bg-gray-50 rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 border border-gray-200"
          >
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {/* Name */}
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    placeholder="이름을 입력하세요"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 md:px-6 py-3 md:py-3.5 bg-white/90 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                      isFieldValid('name')
                        ? 'focus:ring-green-500 border-2 border-green-500'
                        : formErrors.name && touched.name
                        ? 'focus:ring-red-500 border-2 border-red-500'
                        : 'focus:ring-orange-500'
                    }`}
                  />
                  <AnimatePresence>
                    {isFieldValid('name') && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Check size={20} className="text-green-500" />
                      </motion.div>
                    )}
                    {formErrors.name && touched.name && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                        <AlertCircle size={20} className="text-red-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {formErrors.name && touched.name && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-2">
                      {formErrors.name}
                    </motion.p>
                  )}
                </div>

                {/* Phone */}
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="010-0000-0000"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-6 py-3.5 bg-white/90 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                      isFieldValid('phone')
                        ? 'focus:ring-green-500 border-2 border-green-500'
                        : formErrors.phone && touched.phone
                        ? 'focus:ring-red-500 border-2 border-red-500'
                        : 'focus:ring-orange-500'
                    }`}
                  />
                  <AnimatePresence>
                    {isFieldValid('phone') && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Check size={20} className="text-green-500" />
                      </motion.div>
                    )}
                    {formErrors.phone && touched.phone && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                        <AlertCircle size={20} className="text-red-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {formErrors.phone && touched.phone && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-2">
                      {formErrors.phone}
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="example@company.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-6 py-3.5 bg-white/90 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                      isFieldValid('email')
                        ? 'focus:ring-green-500 border-2 border-green-500'
                        : formErrors.email && touched.email
                        ? 'focus:ring-red-500 border-2 border-red-500'
                        : 'focus:ring-orange-500'
                    }`}
                  />
                  <AnimatePresence>
                    {isFieldValid('email') && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Check size={20} className="text-green-500" />
                      </motion.div>
                    )}
                    {formErrors.email && touched.email && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                        <AlertCircle size={20} className="text-red-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {formErrors.email && touched.email && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-2">
                      {formErrors.email}
                    </motion.p>
                  )}
                </div>

                {/* Company */}
                <div className="relative">
                  <input
                    type="text"
                    name="company"
                    placeholder="회사명을 입력하세요"
                    value={formData.company}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`w-full px-6 py-3.5 bg-white/90 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                      isFieldValid('company')
                        ? 'focus:ring-green-500 border-2 border-green-500'
                        : formErrors.company && touched.company
                        ? 'focus:ring-red-500 border-2 border-red-500'
                        : 'focus:ring-orange-500'
                    }`}
                  />
                  <AnimatePresence>
                    {isFieldValid('company') && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Check size={20} className="text-green-500" />
                      </motion.div>
                    )}
                    {formErrors.company && touched.company && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                        <AlertCircle size={20} className="text-red-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {formErrors.company && touched.company && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-2">
                      {formErrors.company}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="relative">
                <textarea
                  name="message"
                  placeholder="어떤 도움이 필요하신가요? 고민하고 계신 부분을 자세히 적어주시면 더 정확한 맞춤 상담이 가능합니다."
                  value={formData.message}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  rows={4}
                  className={`w-full px-4 md:px-6 py-3 md:py-4 bg-white/90 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all resize-none ${
                    isFieldValid('message')
                      ? 'focus:ring-green-500 border-2 border-green-500'
                      : formErrors.message && touched.message
                      ? 'focus:ring-red-500 border-2 border-red-500'
                      : 'focus:ring-orange-500'
                  }`}
                />
                <AnimatePresence>
                  {isFieldValid('message') && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute right-4 top-6">
                      <Check size={20} className="text-green-500" />
                    </motion.div>
                  )}
                  {formErrors.message && touched.message && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute right-4 top-6">
                      <AlertCircle size={20} className="text-red-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
                {formErrors.message && touched.message && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-2">
                    {formErrors.message}
                  </motion.p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-orange-500 text-white rounded-lg font-bold text-base hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>제출하는 중...</span>
                  </>
                ) : (
                  <span>무료 상담 신청하기</span>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedService(null)}
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 p-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900">{selectedService.details.title}</h2>
              </div>
              <div className="p-4 sm:p-6 md:p-8">
                {selectedService.details.benefits && selectedService.details.benefits.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <span className="text-2xl">✨</span> 기대 효과
                    </h3>
                    <div className="space-y-4">
                      {selectedService.details.benefits.map((benefit, i) => (
                        <div key={i} className="pb-4 border-b border-gray-100 last:border-b-0">
                          <h4 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h4>
                          <p className="text-gray-700 leading-relaxed">{benefit.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedService.details.services && selectedService.details.services.length > 0 && (
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-6">• 서비스 상세</h3>
                    <div className="space-y-6">
                      {selectedService.details.services.map((svc, i) => (
                        <div key={i}>
                          <h4 className="text-xl font-bold text-gray-900 mb-2">• {svc.title}</h4>
                          <p className="text-gray-700 leading-relaxed ml-4">{svc.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={32} className="text-green-500" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">상담 신청 완료</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                소중한 문의가 정상적으로 접수되었습니다.
                <br />
                24시간 이내에 담당자가 연락드리겠습니다.
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                확인
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
