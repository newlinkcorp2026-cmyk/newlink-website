import React from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true, margin: '0px 0px -100px 0px' },
};

interface HeroSectionProps {
  mousePos: { x: number; y: number };
}

export default function HeroSection({ mousePos }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-animate" style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 50%, #ffffff 100%, #fafafa 150%, #ffffff 200%)'
    }}>
      {/* Interactive cursor-following gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(circle ${window.innerWidth < 768 ? '150px' : '300px'} at ${mousePos.x}px ${mousePos.y}px, rgba(249, 115, 22, 0.35) 0%, rgba(249, 115, 22, 0.15) 40%, rgba(249, 115, 22, 0.03) 70%, transparent 100%)`,
        transition: 'background 0.1s ease-out',
        zIndex: 1,
        filter: 'blur(12px)'
      }} />

      {/* Radial gradient burn effect - top right corner */}
      <div className="absolute top-0 right-0 pointer-events-none" style={{
        width: '700px',
        height: '700px',
        background: 'radial-gradient(circle at 100% 0%, rgba(249, 115, 22, 0.25) 0%, rgba(249, 115, 22, 0.08) 25%, transparent 55%)',
        filter: 'blur(80px)',
        zIndex: 0
      }} />

      {/* Accent line - bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{
        height: '2px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(249, 115, 22, 0.4) 50%, transparent 100%)'
      }} />

      {/* Floating animated orbs */}
      <motion.div
        className="absolute w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(249, 115, 22, 0.15), rgba(249, 115, 22, 0.02))',
          top: '10%',
          left: '5%',
          filter: 'blur(40px)',
          zIndex: 0
        }}
        animate={{ y: [0, 30, 0], x: [0, 15, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-40 h-40 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(249, 115, 22, 0.12), rgba(249, 115, 22, 0.01))',
          bottom: '5%',
          right: '8%',
          filter: 'blur(50px)',
          zIndex: 0
        }}
        animate={{ y: [0, -40, 0], x: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className="container relative z-20 flex flex-col items-center justify-between min-h-screen">
        <motion.div {...fadeInUp} className="text-center max-w-4xl mx-auto pt-20 md:pt-24 lg:pt-32">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            유입부터 전환까지
            <br />
            <span className="text-orange-500">함께 운영합니다</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-10 sm:mb-8 leading-relaxed">
            NEWLINK는 단순한 노출에 만족하지 않습니다.
            <br />
            현장에서 검증된 실전 마케팅 솔루션으로 대표님의 비즈니스에 확실한 성장을 연결합니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg mx-auto">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-orange-500 text-white rounded-full font-semibold hover:bg-white hover:text-orange-500 transition-all duration-300 ease-out shadow-lg hover:shadow-2xl"
              onClick={() => {
                const element = document.getElementById('contact');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              내 매장 무료 진단하기
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base text-gray-900 rounded-full font-semibold transition-all duration-300 ease-out flex items-center justify-center gap-2 hover:shadow-lg border border-gray-300"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/files/newlink-company-profile.pdf';
                link.download = '뉴링크_광고상품소개서.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <span>광고 상품 보기</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
