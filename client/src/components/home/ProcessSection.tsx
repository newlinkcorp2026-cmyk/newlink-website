import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true, margin: '0px 0px -100px 0px' },
};

const processes = [
  {
    number: '01',
    title: '비즈니스 분석 & 방향 설계',
    description: '현재 운영 상황과 업종 특성을 분석하고\n비즈니스에 맞는 마케팅 방향을 정리합니다.',
  },
  {
    number: '02',
    title: '브랜드 & 콘텐츠 기획',
    description: '비즈니스에 맞는 톤과 메시지를 설정하고\n콘텐츠 운영 방향까지 함께 기획합니다.',
  },
  {
    number: '03',
    title: '디자인 & 콘텐츠 제작',
    description: '광고와 콘텐츠 흐름에 맞춰\n실제 운영에 활용할 콘텐츠를 제작합니다.',
  },
  {
    number: '04',
    title: '광고 운영 & 마케팅 실행',
    description: '블로그, 광고, 콘텐츠 등 필요한 채널을 운영하고\n실제 유입과 반응 데이터를 함께 확인합니다.',
  },
  {
    number: '05',
    title: '성과 분석 & 최적화',
    description: '주간/월간 리포트를 통해\n성과를 분석하고 지속적으로 개선합니다.',
  },
  {
    number: '06',
    title: '지속적인 운영 & 개선',
    description: '시장 변화에 맞춰 전략을 조정하고\n장기적인 성장을 함께 만들어갑니다.',
  },
];

interface ProcessSectionProps {
  activeStep: number;
  timelineProgress: number;
  timelineRef: React.RefObject<HTMLDivElement>;
}

export default function ProcessSection({ activeStep, timelineProgress, timelineRef }: ProcessSectionProps) {
  return (
    <section id="process" className="py-12 md:py-24 lg:py-28 bg-gradient-to-b from-gray-50/50 to-white relative overflow-hidden">
      <div className="container relative z-10">
        <motion.div {...fadeInUp} className="text-center mb-12 md:mb-16">
          <p className="text-orange-500 font-semibold text-sm mb-4">어떻게 해결해야할까요?</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
            운영은 바쁜데
            <br />
            성과는 애매하다면
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            뉴링크의 마케팅을 대하는 여섯가지 방식으로 감에 의존하지 않고,  체계적으로 해결합니다.
          </p>
        </motion.div>

        {/* True Centered Timeline */}
        <div className="relative" ref={timelineRef}>
          {/* Background Vertical Line - Limited to 95% */}
          <div className="absolute left-1/2 top-0 w-1 bg-gray-200 transform -translate-x-1/2 z-0" style={{ height: '95%' }} />

          {/* Progress Vertical Line */}
          <motion.div
            className="absolute left-1/2 top-0 w-1 bg-orange-500 transform -translate-x-1/2 z-0 origin-top"
            style={{ height: `${timelineProgress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />

          {/* Timeline Items Container */}
          <div className="relative z-10">
            {processes.map((process, idx) => {
              const isLeft = idx % 2 === 0;
              const isActive = activeStep >= idx;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, margin: '0px 0px -100px 0px' }}
                  className="relative flex items-center mb-6 sm:mb-8 md:mb-12 lg:mb-16 last:mb-0"
                  style={{ minHeight: '100px' }}
                >
                  {/* Left Side */}
                  <div className="w-1/2 flex justify-end pr-2 sm:pr-3 md:pr-8 lg:pr-10">
                    {isLeft ? (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.08 }}
                        viewport={{ once: true }}
                        className={`w-full max-w-xs rounded-lg p-3 sm:p-4 md:p-6 lg:p-7 transition-all duration-300 ${
                          isActive
                            ? 'bg-white border border-orange-200 shadow-lg'
                            : 'bg-gray-50 border border-gray-100 shadow-sm'
                        }`}
                      >
                        <h3 className={`text-xs sm:text-sm md:text-lg font-semibold mb-2 sm:mb-3 leading-snug transition-colors duration-300 ${
                          isActive ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {process.title}
                        </h3>
                        <p className={`text-xs sm:text-xs md:text-sm leading-relaxed whitespace-pre-line transition-colors duration-300 ${
                          isActive ? 'text-gray-600' : 'text-gray-500'
                        }`}>
                          {process.description}
                        </p>
                      </motion.div>
                    ) : null}
                  </div>

                  {/* Center - Timeline Node */}
                  <div className="flex justify-center w-0 relative">
                    <motion.div
                      className={`w-10 h-10 sm:w-11 sm:h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-sm sm:text-base md:text-xl shadow-md transition-all duration-300 relative z-20 flex-shrink-0 ${
                        isActive
                          ? 'bg-orange-500 text-white border-2 border-orange-500'
                          : 'bg-white border-2 border-gray-300 text-gray-600'
                      }`}
                      animate={isActive ? { scale: 1.08 } : { scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {process.number}
                    </motion.div>

                    {idx === 5 && isActive && (
                      <>
                        <motion.div
                          className="absolute w-10 h-10 sm:w-11 sm:h-11 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600"
                          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
                        />
                        <motion.div
                          className="absolute w-10 h-10 sm:w-11 sm:h-11 md:w-14 md:h-14 rounded-full border border-orange-400"
                          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.2, 0.8] }}
                          transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity }}
                        />
                        <motion.div
                          className="absolute"
                          animate={{ scale: [0.8, 1], opacity: [0, 1] }}
                          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                        >
                          <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" className="text-orange-600" />
                          </svg>
                        </motion.div>
                      </>
                    )}
                  </div>

                  {/* Right Side */}
                  <div className="w-1/2 flex justify-start pl-2 sm:pl-3 md:pl-8 lg:pl-10">
                    {!isLeft ? (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.08 }}
                        viewport={{ once: true }}
                        className={`w-full max-w-xs rounded-lg p-3 sm:p-4 md:p-6 lg:p-7 transition-all duration-300 ${
                          isActive
                            ? 'bg-white border border-orange-200 shadow-lg'
                            : 'bg-gray-50 border border-gray-100 shadow-sm'
                        }`}
                      >
                        <h3 className={`text-xs sm:text-sm md:text-lg font-semibold mb-2 sm:mb-3 leading-snug transition-colors duration-300 ${
                          isActive ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {process.title}
                        </h3>
                        <p className={`text-xs sm:text-xs md:text-sm leading-relaxed whitespace-pre-line transition-colors duration-300 ${
                          isActive ? 'text-gray-600' : 'text-gray-500'
                        }`}>
                          {process.description}
                        </p>
                      </motion.div>
                    ) : null}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
