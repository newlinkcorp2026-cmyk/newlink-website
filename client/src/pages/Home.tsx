import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import ProblemsSection from '../components/home/ProblemsSection';
import ProcessSection from '../components/home/ProcessSection';
import ServicesSection from '../components/home/ServicesSection';
import ResultsSection from '../components/home/ResultsSection';
import ContactSection from '../components/home/ContactSection';
import Footer from '../components/home/Footer';

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

const services = [
  {
    title: '정밀 트래픽 & 플레이스 최적화',
    description: '소비자가 검색 시, 매장을 가장 먼저 보이게 선점합니다.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663704927043/UrH9V4w7NuPVJZJrMt7GYH/solution-blog-marketing-eXhHiBcWFuM8HDQdvbAztb.webp',
    details: {
      title: '블로그 마케팅 서비스',
      benefits: [
        { title: '상단 노출', description: '핵심 키워드 검색 시 블로그 탭 상단 점유로 유입 극대화' },
        { title: '정보 전달', description: '상세한 이미지와 텍스트로 브랜드 가치를 깊이 있게 전달' },
        { title: '바이럴 확산', description: '양질의 콘텐츠가 자발적으로 공유되는 2차 확산 효과' },
      ],
      services: [
        { title: '최적화 블로그', description: '고지수 블로그를 활용하여 메인 키워드 검색 시 상위 노출 확률을 높입니다. 브랜드 전문성을 가장 효과적으로 알리는 방법입니다.' },
        { title: '블로그 체험단', description: '실제 체험 후기를 통해 자연스러운 입소문과 고퀄리티 콘텐츠를 생성합니다. 잠재 고객에게 거부감 없는 정보 전달이 가능합니다.' },
        { title: '블로그 기자단/배포', description: '단기간 내 대량의 정보성 포스팅을 배포하여 브랜드 키워드 점유율을 극대화합니다. 저비용 고효율로 온라인 신뢰도를 구축합니다.' },
      ],
    },
  },
  {
    title: '고품질 블로그 기자단 & 체험단',
    description: '진짜 구매 후기로 소비자의 의심을 확신으로 바꿉니다.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663704927043/UrH9V4w7NuPVJZJrMt7GYH/solution-review-management-QYRUAsZEY9iWbULc2JQrWJ.webp',
    details: {
      title: '리뷰 관리 서비스',
      benefits: [
        { title: '신뢰도 구축', description: '높은 평점으로 고객 신뢰도를 높이고 신뢰도 있는 브랜드 이미지 구축' },
        { title: '문의 증가', description: '리뷰 관리로 신뢰도 높아지고 문의 증가' },
        { title: '지역 검색 역량', description: '로컬 검색 순위 상승으로 방문객 증대' },
      ],
      services: [
        { title: '플레이스 프로필 최적화', description: '비즈니스 정보를 완성하고 사진을 추가하며 리뷰 신뢰도를 높입니다.' },
        { title: '리뷰 모니터링 및 관리', description: '리뷰를 모니터링하며 부정적인 리뷰에 대한 브랜드 중심 대응을 실시간으로 진행합니다.' },
        { title: '고객 응답 전략', description: '리뷰에 대한 성실한 응답으로 리뷰 신뢰도를 높이고 고객 만족도를 높입니다.' },
      ],
    },
  },
  {
    title: '로컬 커뮤니티 타겟팅',
    description: '당근마켓, 맘카페 등 핵심 로컬 커뮤니티에 자연스럽게 침투합니다.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663704927043/UrH9V4w7NuPVJZJrMt7GYH/solution-ad-operation-99xcUJDqFiHWSMKYj8tebU.webp',
    details: {
      title: '광고 운영 서비스',
      benefits: [
        { title: '높은 ROI 달성', description: '네이버, 카카오, 구글 등 다중 플랫폼에서 동시에 높은 성과를 거두는 광고 전략' },
        { title: '데이터 기반 최적화', description: '실시간 데이터 분석을 통한 시간 단위 중점 조정으로 최적 성과 달성' },
        { title: '비용 효율 극대화', description: '마케팅 단계별 효율적인 예산 배분으로 마케팅 비용 효율 극대화' },
      ],
      services: [
        { title: '네이버 광고', description: '네이버 검색 광고, 디스플레이 광고, 쇼핑 광고 등 다양한 상품을 중점적으로 운영하며 높은 성과를 달성합니다.' },
        { title: '구글 광고', description: '구글 검색 광고, 구글 디스플레이 광고 등을 중점적으로 운영하며 높은 전환율을 달성합니다.' },
        { title: '카카오 광고', description: '카카오 검색 광고, 카카오 디스플레이 광고 등을 중점적으로 운영하며 높은 성과를 달성합니다.' },
      ],
    },
  },
  {
    title: '영수증 리뷰 빌드업',
    description: '실제 방문객 피드백으로 매장의 신뢰도 상승과 최종 구매로 연결합니다.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663704927043/UrH9V4w7NuPVJZJrMt7GYH/solution-data-analytics-hwsPqZAMNPY9iPaXLCHkhy.webp',
    details: {
      title: '데이터 분석 서비스',
      benefits: [
        { title: '대시보드 제공', description: '마케팅 성과를 실시간으로 확인할 수 있는 대시보드 제공' },
        { title: '상세 분석', description: '마케팅 채널별, 상품별, 기간별 상세 성과 분석 제공' },
        { title: '최적화 제안', description: '데이터 기반 마케팅 최적화 안을 제시하여 마케팅 성과 극대화' },
      ],
      services: [
        { title: '실시간 대시보드', description: '마케팅 성과를 실시간으로 모니터링하며 간편한 상태 업데이트 제공' },
        { title: '상세 성과 분석', description: '마케팅 채널별, 상품별, 기간별 상세 성과 분석 제공' },
        { title: '최적화 안내', description: '데이터 기반 마케팅 최적화 안내 및 개선 제공' },
      ],
    },
  },
];

const navItems = [
  { label: '고민이 있나요?', id: 'problems' },
  { label: '진행 방식', id: 'process' },
  { label: '솔루션', id: 'services' },
  { label: '운영 결과', id: 'results' },
];

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState<FormData>({ name: '', phone: '', email: '', company: '', message: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [countedValues, setCountedValues] = useState<Record<string, number>>({});
  const resultsCardRef = useRef<HTMLDivElement>(null);

  // Timeline scroll interaction
  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const timelineHeight = rect.height;
      let progress = 0;

      if (rect.top < windowHeight && rect.bottom > 0) {
        const visibleStart = Math.max(0, windowHeight - rect.top);
        const totalDistance = windowHeight + timelineHeight;
        progress = Math.min(100, (visibleStart / totalDistance) * 120);
      } else if (rect.top >= windowHeight) {
        progress = 0;
      } else if (rect.bottom <= 0) {
        progress = 100;
      }

      setTimelineProgress(Math.max(0, Math.min(95, progress)));

      const cardHeight = timelineHeight / 6;
      const viewportCenter = windowHeight / 2;
      const relativeCenter = viewportCenter - rect.top;
      const activeStepIndex = Math.floor(relativeCenter / cardHeight);
      setActiveStep(Math.max(-1, Math.min(5, activeStepIndex)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Counter animation
  const animateCounter = (targetValue: number, duration: number = 1000) => {
    const startTime = Date.now();
    const key = `counter-${currentSlide}`;
    const updateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCountedValues(prev => ({ ...prev, [key]: Math.floor(targetValue * progress) }));
      if (progress < 1) requestAnimationFrame(updateCounter);
    };
    updateCounter();
  };

  useEffect(() => {
    setCountedValues({});
    animateCounter(250, 1200);
  }, [currentSlide]);

  // Form validation
  function validateField(name: string, value: string): string | undefined {
    switch (name) {
      case 'name':
        if (!value.trim()) return '이름을 입력해주세요';
        if (value.trim().length < 2) return '이름은 2글자 이상이어야 합니다';
        return undefined;
      case 'phone':
        if (!value.trim()) return '전화번호를 입력해주세요';
        if (!/^[0-9\-]{10,}$/.test(value.trim())) return '올바른 전화번호 형식이 아닙니다';
        return undefined;
      case 'email':
        if (!value.trim()) return '이메일을 입력해주세요';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return '올바른 이메일 형식이 아닙니다';
        return undefined;
      case 'company':
        if (!value.trim()) return '회사명을 입력해주세요';
        if (value.trim().length < 2) return '회사명은 2글자 이상이어야 합니다';
        return undefined;
      case 'message':
        if (!value.trim()) return '문의 내용을 입력해주세요';
        if (value.trim().length < 10) return '문의 내용은 10글자 이상이어야 합니다';
        return undefined;
      default:
        return undefined;
    }
  }

  const isFieldValid = (fieldName: string): boolean => {
    const value = formData[fieldName as keyof FormData];
    return Boolean(touched[fieldName]) && Boolean(value) && !formErrors[fieldName as keyof FormErrors];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setFormErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) errors[key as keyof FormErrors] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setTouched({ name: true, phone: true, email: true, company: true, message: true });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || '메일 전송 실패');

      setShowSuccessModal(true);
      setFormData({ name: '', phone: '', email: '', company: '', message: '' });
      setTouched({});
      setFormErrors({});
      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (error) {
      console.error(error);
      alert('문의 접수에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 커스텀 마우스 커서 */}
      <motion.div
        className="fixed w-6 h-6 border-2 border-orange-500 rounded-full pointer-events-none z-[9999] hidden md:block"
        animate={{ x: mousePos.x - 12, y: mousePos.y - 12 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
      <motion.div
        className="fixed w-2 h-2 bg-orange-500 rounded-full pointer-events-none z-[9999] hidden md:block"
        animate={{ x: mousePos.x - 4, y: mousePos.y - 4 }}
        transition={{ type: 'spring', stiffness: 1000, damping: 40 }}
      />

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="container flex items-center justify-between h-20">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-shrink-0">
              <img src="/images/logo-black.png" alt="NEWLINK" className="h-6 sm:h-7 md:h-8 w-auto" />
            </motion.div>

            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ color: '#FF5000' }}
                  className="text-gray-600 hover:text-orange-500 text-sm font-medium transition-colors"
                  onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-colors"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              지금 문의하기
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-gray-100 bg-white"
              >
                <div className="container py-4 space-y-3">
                  {navItems.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: 4 }}
                      className="block w-full text-left px-4 py-2 text-gray-600 hover:text-orange-500 font-medium transition-colors"
                      onClick={() => {
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                        setMobileMenuOpen(false);
                      }}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <HeroSection mousePos={mousePos} />
        <AboutSection />
        <ProblemsSection />
        <ProcessSection
          activeStep={activeStep}
          timelineProgress={timelineProgress}
          timelineRef={timelineRef}
        />
        <ServicesSection
          services={services}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
        />
        <ResultsSection
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          countedValues={countedValues}
          resultsCardRef={resultsCardRef}
        />
        <ContactSection
          formData={formData}
          formErrors={formErrors}
          touched={touched}
          isSubmitting={isSubmitting}
          showSuccessModal={showSuccessModal}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          setShowSuccessModal={setShowSuccessModal}
          isFieldValid={isFieldValid}
          handleInputChange={handleInputChange}
          handleBlur={handleBlur}
          handleSubmit={handleSubmit}
        />
        <Footer />

        {/* 모바일 플로팅 CTA 버튼 */}
        <motion.button
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 md:hidden w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center z-40 hover:bg-orange-600 transition-colors"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </motion.button>
      </div>
    </>
  );
}
