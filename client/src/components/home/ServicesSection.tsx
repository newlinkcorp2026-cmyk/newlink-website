import React from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true, margin: '0px 0px -100px 0px' },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  viewport: { once: true, margin: '0px 0px -100px 0px' },
};

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

interface ServicesSectionProps {
  services: Service[];
  selectedService: Service | null;
  setSelectedService: (service: Service | null) => void;
}

export default function ServicesSection({ services, selectedService, setSelectedService }: ServicesSectionProps) {
  return (
    <section id="services" className="py-16 md:py-24 lg:py-28 bg-gradient-to-b from-white to-gray-50/50 relative overflow-hidden">
      <div className="container relative z-10">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <p className="text-orange-500 font-semibold text-sm mb-4">어떤 솔루션을 제공하나요?</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
            비즈니스 상황에 맞는
            <br />
            실전형 마케팅 솔루션을 운영합니다
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            리뷰 관리부터 블로그 마케팅, 트래픽 운영까지
            <br />
            실제 유입과 전환에 필요한 마케팅을 비즈니스 상황에 맞춰 함께 운영합니다.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: '0px 0px -100px 0px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6"
        >
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              onClick={() => setSelectedService(service)}
              className="relative overflow-hidden rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-orange-200 group bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-orange-50 group-hover:to-orange-100 flex flex-col cursor-pointer"
            >
              {service.image && (
                <div className="relative h-24 sm:h-28 md:h-40 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <motion.img
                    src={service.image}
                    alt={service.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              )}
              <div className="flex-1 p-3 sm:p-4 md:p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-extrabold text-gray-900 mb-2 sm:mb-3 md:mb-4 group-hover:text-orange-600 transition-colors duration-300 leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-xs md:text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {service.description}
                  </p>
                </div>
                <div className="mt-3 sm:mt-4 text-orange-600 text-xs font-semibold flex items-center gap-1">
                  <span>자세히 보기</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
