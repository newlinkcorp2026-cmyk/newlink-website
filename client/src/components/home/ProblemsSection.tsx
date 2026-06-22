import React from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true, margin: '0px 0px -100px 0px' },
};

export default function ProblemsSection() {
  return (
    <section id="problems" className="py-16 md:py-24 lg:py-28 bg-white relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="container relative z-10">
        {/* Header Section */}
        <motion.div {...fadeInUp} className="text-center mb-16">
          <p className="text-orange-500 font-semibold text-sm mb-4">어디서부터 시작해야 할까요?</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
            이런 고민,
            <br />
            <span className="text-orange-500">한 번쯤 있으셨을 겁니다</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            해야 할 일은 많은데 무엇부터 정리해야 할지 어려워집니다.
          </p>
        </motion.div>

        {/* Chat-Style Messages */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '0px 0px -100px 0px' }}
          className="max-w-2xl mx-auto space-y-4"
        >
          {/* Message 1 */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: 'easeOut' }}
            viewport={{ once: true }}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className="flex justify-start"
          >
            <div className="max-w-xs bg-gray-100 rounded-2xl rounded-tl-none px-3 sm:px-4 py-2 sm:py-3 shadow-md hover:shadow-xl transition-all cursor-pointer">
              <p className="text-gray-900 font-semibold text-xs sm:text-sm leading-snug">광고는 돌리고 있는데 문의가 안 들어와요</p>
              <p className="text-gray-700 text-xs sm:text-sm mt-1 leading-snug">유입은 생기는데 실제 구매 전환까지 이어지지 않습니다.</p>
            </div>
          </motion.div>

          {/* Message 2 */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            viewport={{ once: true }}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className="flex justify-end"
          >
            <div className="max-w-xs bg-gray-100 rounded-2xl rounded-tr-none px-3 sm:px-4 py-2 sm:py-3 shadow-md hover:shadow-xl transition-all cursor-pointer">
              <p className="text-gray-900 font-semibold text-xs sm:text-sm leading-snug">블로그와 SNS를 운영해보고 싶어요</p>
              <p className="text-gray-700 text-xs sm:text-sm mt-1 leading-snug">콘텐츠는 쌓이는데 무엇을 해야 하는지 모르겠습니다.</p>
            </div>
          </motion.div>

          {/* Message 3 */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
            viewport={{ once: true }}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className="flex justify-start"
          >
            <div className="max-w-xs bg-gray-100 rounded-2xl rounded-tl-none px-3 sm:px-4 py-2 sm:py-3 shadow-md hover:shadow-xl transition-all cursor-pointer">
              <p className="text-gray-900 font-semibold text-xs sm:text-sm leading-snug">광고, 콘텐츠가 따로 움직이고 있어요</p>
              <p className="text-gray-700 text-xs sm:text-sm mt-1 leading-snug">채널은 많아졌는데 메시지는 점점 흐려지고 있습니다.</p>
            </div>
          </motion.div>

          {/* Message 4 */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
            viewport={{ once: true }}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className="flex justify-end"
          >
            <div className="max-w-xs bg-gray-100 rounded-2xl rounded-tr-none px-3 sm:px-4 py-2 sm:py-3 shadow-md hover:shadow-xl transition-all cursor-pointer">
              <p className="text-gray-900 font-semibold text-xs sm:text-sm leading-snug">운영할 건 많은데 실행할 시간이 없어요</p>
              <p className="text-gray-700 text-xs sm:text-sm mt-1 leading-snug">운영만으로도 바빠 마케팅까지 챙기기 어려운 상황입니다.</p>
            </div>
          </motion.div>

          {/* Response Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
            className="flex justify-center mt-8"
          >
            <div className="max-w-sm bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-orange-400/30">
              <p className="text-white font-bold text-sm sm:text-base text-center leading-snug">이 모든 고민들, 함께 정리해드립니다.</p>
              <p className="text-orange-50 text-xs sm:text-sm mt-2 text-center leading-snug">광고, 콘텐츠, 운영까지 통합적으로 전략을 수립해보세요.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
