import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true, margin: '0px 0px -100px 0px' },
};

const results = [
  {
    type: 'case',
    title: '국제금거래소 OO지점',
    metric: '월 유입 수',
    before: '50건',
    after: '250건',
    improvement: '+400%',
    description: '플레이스 최적화와 리뷰 관리로 유입 극대화',
    background: '신규 지점 오픈 후 초기 유입이 저조했습니다. 플레이스 정보 최적화와 체계적인 리뷰 관리를 통해 검색 노출을 높이고, 고객 신뢰도를 빠르게 구축했습니다.',
    details: {
      keywordRank: { before: 16, after: 3 },
      duration: '25일',
      totalTraffic: '37,500건',
      totalReviews: '95건',
      blogPosts: '10건',
      actions: ['플레이스 최적화', '리뷰 관리', '블로그 콘텐츠'],
      chartData: [
        { day: '1일', before: 50, after: 80 },
        { day: '5일', before: 50, after: 120 },
        { day: '10일', before: 50, after: 160 },
        { day: '15일', before: 50, after: 200 },
        { day: '20일', before: 50, after: 230 },
        { day: '25일', before: 50, after: 250 },
      ],
    },
  },
  {
    type: 'case',
    title: '국제금거래소 OO지점',
    metric: '월 유입 수',
    before: '30건',
    after: '180건',
    improvement: '+500%',
    description: '신규 지점 마케팅으로 빠른 성장 달성',
    background: '신규 지점 런칭 시 브랜드 인지도가 낮아 자연 유입이 거의 없었습니다. 검색 노출 개선과 리뷰 빌드업을 통해 초기 고객 확보에 집중했고, 지속적인 콘텐츠 운영으로 안정적인 성장을 달성했습니다.',
    details: {
      keywordRank: { before: 22, after: 5 },
      duration: '30일',
      totalTraffic: '28,000건',
      totalReviews: '72건',
      blogPosts: '8건',
      actions: ['검색 노출 개선', '리뷰 빌드업', '콘텐츠 운영'],
      chartData: [
        { day: '1일', before: 30, after: 45 },
        { day: '5일', before: 30, after: 85 },
        { day: '10일', before: 30, after: 110 },
        { day: '15일', before: 30, after: 140 },
        { day: '20일', before: 30, after: 165 },
        { day: '30일', before: 30, after: 180 },
      ],
    },
  },
  {
    type: 'case',
    title: '국제금거래소 OO지점',
    metric: '월 유입 수',
    before: '40건',
    after: '220건',
    improvement: '+450%',
    description: '검색 노출이 꾸준히 증가했습니다',
    background: '기존 지점이지만 검색 순위가 낮아 유입 증가에 한계가 있었습니다. 플레이스 정보 재정비와 검색 최적화를 진행하면서 동시에 고품질 블로그 콘텐츠를 꾸준히 발행하여 자연 유입을 극대화했습니다.',
    details: {
      keywordRank: { before: 18, after: 4 },
      duration: '28일',
      totalTraffic: '35,200건',
      totalReviews: '88건',
      blogPosts: '9건',
      actions: ['플레이스 최적화', '검색 노출 개선', '블로그 마케팅'],
      chartData: [
        { day: '1일', before: 40, after: 70 },
        { day: '5일', before: 40, after: 110 },
        { day: '10일', before: 40, after: 145 },
        { day: '15일', before: 40, after: 175 },
        { day: '20일', before: 40, after: 205 },
        { day: '28일', before: 40, after: 220 },
      ],
    },
  },
];

interface ResultsSectionProps {
  currentSlide: number;
  setCurrentSlide: (idx: number) => void;
  countedValues: Record<string, number>;
  resultsCardRef: React.RefObject<HTMLDivElement>;
}

export default function ResultsSection({
  currentSlide,
  setCurrentSlide,
  countedValues,
  resultsCardRef,
}: ResultsSectionProps) {
  return (
    <section id="results" className="py-16 md:py-24 lg:py-28 bg-white relative overflow-hidden">
      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div {...fadeInUp} className="text-center mb-16">
          <p className="text-orange-500 font-semibold text-sm mb-4">운영 결과는 어떨까요?</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
            실제 성과로 증명합니다
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            마케팅 용어가 아닌, 실제 비즈니스 변화를 숫자로 보여드립니다.
          </p>
        </motion.div>

        {/* Case Studies Slider */}
        <div className="space-y-10">
          <motion.div
            ref={resultsCardRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: '0px 0px -100px 0px' }}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-100 bg-white overflow-x-auto scroll-smooth tab-scroll" style={{
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {results.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`flex-1 min-w-fit px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
                    idx === currentSlide
                      ? 'text-gray-900 border-orange-500 bg-white'
                      : 'text-gray-400 border-transparent hover:text-gray-600'
                  }`}
                >
                  {result.title}
                </button>
              ))}
            </div>
            <style>{`
              .tab-scroll {
                -webkit-overflow-scrolling: touch;
              }
              .tab-scroll::-webkit-scrollbar {
                display: none;
              }
              .tab-scroll::-webkit-scrollbar-track {
                display: none;
              }
            `}</style>

            {/* Tab Content */}
            <div className="p-6 sm:p-8 md:p-12 lg:p-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-12">
                    {/* Background Context */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-50/50 rounded-lg p-4 sm:p-5 md:p-6 border border-orange-100">
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        {results[currentSlide].background}
                      </p>
                    </div>

                    {/* Result First - Main Focus with Side Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                      {/* Left Column - Main Metric and Headline */}
                      <div className="lg:col-span-2 space-y-3">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500 font-medium mb-2 uppercase tracking-wide">{results[currentSlide].metric}</p>
                          <div className="flex items-baseline gap-3 sm:gap-4">
                            <p className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900">
                              {countedValues[`counter-${currentSlide}`] || 0}건
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold text-orange-600">{results[currentSlide].improvement}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-snug">
                            {results[currentSlide].description}
                          </h3>
                        </div>
                      </div>

                      {/* Right Column - Key Metrics Cards */}
                      <div className="lg:col-span-1 space-y-2">
                        <div className="bg-white rounded-lg border border-gray-200 p-3 hover:border-orange-200 transition-colors">
                          <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">진행 기간</p>
                          <p className="text-base font-bold text-gray-900">{results[currentSlide].details?.duration}</p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-3 hover:border-orange-200 transition-colors">
                          <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">총 유입</p>
                          <p className="text-base font-bold text-gray-900">{results[currentSlide].details?.totalTraffic}</p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-3 hover:border-orange-200 transition-colors">
                          <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">생성 리뷰</p>
                          <p className="text-base font-bold text-orange-600">{results[currentSlide].details?.totalReviews}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions as Tags */}
                    <div className="space-y-2 pt-4">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">진행 내용</p>
                      <div className="flex flex-wrap gap-1.5">
                        {results[currentSlide].details?.actions?.map((action: string, idx: number) => (
                          <div key={idx} className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs text-gray-600 font-medium bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200">
                            {action}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Data Section - Before/After Comparison */}
                    {results[currentSlide].details && (
                      <div className="space-y-2 pt-6 border-t border-gray-100">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">성과 비교</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          {/* Ranking Improvement */}
                          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                            <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">검색 순위</p>
                            <div className="flex items-end gap-2">
                              <div>
                                <p className="text-xs text-gray-400 mb-1">이전</p>
                                <p className="text-lg font-bold text-gray-300">{results[currentSlide].details.keywordRank.before}위</p>
                              </div>
                              <svg className="w-4 h-4 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                              <div>
                                <p className="text-xs text-gray-400 mb-1">현재</p>
                                <p className="text-lg font-bold text-orange-600">{results[currentSlide].details.keywordRank.after}위</p>
                              </div>
                              <div className="ml-auto">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">↑{results[currentSlide].details.keywordRank.before - results[currentSlide].details.keywordRank.after}위</span>
                              </div>
                            </div>
                          </div>

                          {/* Reviews Generated */}
                          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                            <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">생성 리뷰</p>
                            <div className="flex items-end gap-2">
                              <div>
                                <p className="text-xs text-gray-400 mb-1">이전</p>
                                <p className="text-lg font-bold text-gray-300">0건</p>
                              </div>
                              <svg className="w-4 h-4 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                              <div>
                                <p className="text-xs text-gray-400 mb-1">현재</p>
                                <p className="text-lg font-bold text-orange-600">{results[currentSlide].details.totalReviews}</p>
                              </div>
                            </div>
                          </div>

                          {/* Monthly Traffic */}
                          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
                            <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">월 유입</p>
                            <div className="flex items-end gap-2">
                              <div>
                                <p className="text-xs text-gray-400 mb-1">이전</p>
                                <p className="text-lg font-bold text-gray-300">{results[currentSlide].before}</p>
                              </div>
                              <svg className="w-4 h-4 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                              <div>
                                <p className="text-xs text-gray-400 mb-1">현재</p>
                                <p className="text-lg font-bold text-orange-600">{results[currentSlide].after}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2">
            {results.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? 'bg-gray-900 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to case ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
