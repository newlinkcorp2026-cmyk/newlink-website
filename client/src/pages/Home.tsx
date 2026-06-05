import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Menu, X, Check, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    company: '',
    message: '',
  });
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
  const [hasAnimated, setHasAnimated] = useState<Record<number, boolean>>({});

  // Timeline scroll interaction - 타임라인 섹션 기준으로 계산
  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const timelineTop = rect.top;
      const timelineBottom = rect.bottom;
      const timelineHeight = rect.height;

      // 타임라인이 뷰포트에 들어오기 시작할 때부터 진행도 계산
      // timelineTop이 windowHeight일 때 = 0% (아직 안 보임)
      // timelineTop이 0일 때 = 진행 시작
      // timelineBottom이 0일 때 = 100% (완료)
      
      let progress = 0;
      
      if (timelineTop < windowHeight && timelineBottom > 0) {
        // 타임라인이 뷰포트에 보이는 구간
        // 진행도: 타임라인 상단이 뷰포트에 진입한 정도
        const visibleStart = Math.max(0, windowHeight - timelineTop);
        const totalDistance = windowHeight + timelineHeight;
        progress = Math.min(100, (visibleStart / totalDistance) * 120); // 120%로 설정하여 완전히 채워지도록
      } else if (timelineTop >= windowHeight) {
        // 타임라인이 아직 아래에 있음
        progress = 0;
      } else if (timelineBottom <= 0) {
        // 타임라인이 위로 지나감
        progress = 100;
      }
      
      // 진행 선이 06번 원 밖으로 나가지 않도록 제한 (약 95%)
      setTimelineProgress(Math.max(0, Math.min(95, progress)));

      // 활성 단계 계산 - 각 카드가 뷰포트 중앙에 올 때 활성화
      const cardHeight = timelineHeight / 6; // 6개 단계
      const viewportCenter = windowHeight / 2;
      const relativeCenter = viewportCenter - timelineTop;
      const activeStepIndex = Math.floor(relativeCenter / cardHeight);
      
      setActiveStep(Math.max(-1, Math.min(5, activeStepIndex)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 스크롤 속도 감지
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 커스텀 마우스 커서 효과
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 카운팅 애니메이션 효과
  const animateCounter = (targetValue: number, duration: number = 1000) => {
    const startValue = 0;
    const startTime = Date.now();
    const key = `counter-${currentSlide}`;

    const updateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
      
      setCountedValues(prev => ({
        ...prev,
        [key]: currentValue
      }));

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    updateCounter();
  };

  // 탭 변경 시 애니메이션 시작
  useEffect(() => {
    // 이전 애니메이션 초기화
    setCountedValues({});
    
    // 탭 변경 시 즉시 애니메이션 시작 (IntersectionObserver 없음)
    // 나중에 정의되는 results 데이터를 기반으로 대략 250으로 설정
    animateCounter(250, 1200);
  }, [currentSlide]);

  const navItems = [
    { label: '고민이 있나요?', id: 'problems' },
    { label: '진행 방식', id: 'process' },
    { label: '솔루션', id: 'services' },
    { label: '운영 결과', id: 'results' },
  ];

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

  const services = [
    {
      title: '정밀 트래픽 & 플레이스 최적화',
      description: '소비자가 검색 시, 매장을 가장 먼저 보이게 선점합니다.',
      image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663704927043/UrH9V4w7NuPVJZJrMt7GYH/solution-blog-marketing-eXhHiBcWFuM8HDQdvbAztb.webp',
      details: {
        title: '블로그 마케팅 서비스',
        benefits: [
          {
            title: '상단 노출',
            description: '핵심 키워드 검색 시 블로그 탭 상단 점유로 유입 극대화',
          },
          {
            title: '정보 전달',
            description: '상세한 이미지와 텍스트로 브랜드 가치를 깊이 있게 전달',
          },
          {
            title: '바이럴 확산',
            description: '양질의 콘텐츠가 자발적으로 공유되는 2차 확산 효과',
          },
        ],
        services: [
          {
            title: '최적화 블로그',
            description: '고지수 블로그를 활용하여 메인 키워드 검색 시 상위 노출 확률을 높입니다. 브랜드 전문성을 가장 효과적으로 알리는 방법입니다.',
          },
          {
            title: '블로그 체험단',
            description: '실제 체험 후기를 통해 자연스러운 입소문과 고퀄리티 콘텐츠를 생성합니다. 잠재 고객에게 거부감 없는 정보 전달이 가능합니다.',
          },
          {
            title: '블로그 기자단/배포',
            description: '단기간 내 대량의 정보성 포스팅을 배포하여 브랜드 키워드 점유율을 극대화합니다. 저비용 고효율로 온라인 신뢰도를 구축합니다.',
          },
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
          {
            title: '신뢰도 구축',
            description: '높은 평점으로 고객 신뢰도를 높이고 신뢰도 있는 브랜드 이미지 구축',
          },
          {
            title: '문의 증가',
            description: '리뷰 관리로 신뢰도 높아지고 문의 증가',
          },
          {
            title: '지역 검색 역량',
            description: '로컬 검색 순위 상승으로 방문객 증대',
          },
        ],
        services: [
          {
            title: '플레이스 프로필 최적화',
            description: '비즈니스 정보를 완성하고 사진을 추가하며 리뷰 신뢰도를 높입니다. 대표 사진과 로고는 고객의 신뢰도를 높이는 데 중요한 역할을 합니다.',
          },
          {
            title: '리뷰 모니터링 및 관리',
            description: '리뷰를 모니터링하며 부정적인 리뷰에 대한 브랜드 중심 대응을 실시간으로 진행합니다. 리뷰 관리로 대중의 신뢰도를 높이는 데 도움을 드립니다.',
          },
          {
            title: '고객 응답 전략',
            description: '리뷰에 대한 성실한 응답으로 리뷰 신뢰도를 높이고 고객 만족도를 높입니다. 리뷰에 대한 성실한 응답은 대중의 신뢰도를 높이는 데 도움을 드립니다.',
          },
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
          {
            title: '높은 ROI 달성',
            description: '네이버, 카카오, 구글 등 다중 플랫폼에서 동시에 높은 성과를 거두는 광고 전략',
          },
          {
            title: '데이터 기반 최적화',
            description: '실시간 데이터 분석을 통한 시간 단위 중점 조정으로 최적 성과 달성',
          },
          {
            title: '비용 효율 극대화',
            description: '마케팅 단계별 효율적인 예산 배분으로 마케팅 비용 효율 극대화',
          },
        ],
        services: [
          {
            title: '네이버 광고',
            description: '네이버 검색 광고, 디스플레이 광고, 쇼핑 광고 등 다양한 상품을 중점적으로 운영하며 높은 성과를 달성합니다.',
          },
          {
            title: '구글 광고',
            description: '구글 검색 광고, 구글 디스플레이 광고 등을 중점적으로 운영하며 높은 전환율을 달성합니다.',
          },
          {
            title: '카카오 광고',
            description: '카카오 검색 광고, 카카오 디스플레이 광고 등을 중점적으로 운영하며 높은 성과를 달성합니다.',
          },
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
          {
            title: '대시보드 제공',
            description: '마케팅 성과를 실시간으로 확인할 수 있는 대시보드 제공',
          },
          {
            title: '상세 분석',
            description: '마케팅 채널별, 상품별, 기간별 상세 성과 분석 제공',
          },
          {
            title: '최적화 제안',
            description: '데이터 기반 마케팅 최적화 안을 제시하여 마케팅 성과 극대화',
          },
        ],
        services: [
          {
            title: '실시간 대시보드',
            description: '마케팅 성과를 실시간으로 모니터링하며 간편한 상태 업데이트 제공',
          },
          {
            title: '상세 성과 분석',
            description: '마케팅 채널별, 상품별, 기간별 상세 성과 분석 제공',
          },
          {
            title: '최적화 안내',
            description: '데이터 기반 마케팅 최적화 안내 및 개선 제공',
          },
        ],
      },
    },
  ];

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

  // 유효성 검사 함수
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
            setFormData((prev) => ({ ...prev, [name]: value }));

            // 실시간 유효성 검사
            if (touched[name]) {
              const error = validateField(name, value);
              setFormErrors((prev) => ({
                ...prev,
                [name]: error,
              }));
            }
          };

          const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setTouched((prev) => ({ ...prev, [name]: true }));
            const error = validateField(name, value);
            setFormErrors((prev) => ({
              ...prev,
              [name]: error,
            }));
          };

        const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errors: FormErrors = {};

        Object.keys(formData).forEach((key) => {
        const error = validateField(key, formData[key as keyof FormData]);
        if (error) errors[key as keyof FormErrors] = error;
        });

        if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        setTouched({
        name: true,
        phone: true,
        email: true,
        company: true,
        message: true,
        });
        return;
        }
        setIsSubmitting(true);

        try {
        const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || '메일 전송 실패');
        }

        setShowSuccessModal(true);

        setFormData({
          name: '',
          phone: '',
          email: '',
          company: '',
          message: '',
        });

        setTouched({});
        setFormErrors({});

        setTimeout(() => {
          setShowSuccessModal(false);
        }, 3000);

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
        animate={{
          x: mousePos.x - 12,
          y: mousePos.y - 12,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
        }}
      />
      <motion.div
        className="fixed w-2 h-2 bg-orange-500 rounded-full pointer-events-none z-[9999] hidden md:block"
        animate={{
          x: mousePos.x - 4,
          y: mousePos.y - 4,
        }}
        transition={{
          type: 'spring',
          stiffness: 1000,
          damping: 40,
        }}
      />

      <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-shrink-0">
            <img src="/images/logo-black.png" alt="NEWLINK" className="h-6 sm:h-7 md:h-8 w-auto" />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ color: '#FF5000' }}
                className="text-gray-600 hover:text-orange-500 text-sm font-medium transition-colors"
                onClick={() => {
                  const element = document.getElementById(item.id);
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-colors"
            onClick={() => {
              const element = document.getElementById('contact');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            지금 문의하기
          </motion.button>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
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
                      const element = document.getElementById(item.id);
                      element?.scrollIntoView({ behavior: 'smooth' });
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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-animate" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 50%, #ffffff 100%, #fafafa 150%, #ffffff 200%)'
      }}>
        {/* Background animation - subtle floating orbs only */}
        {/* Interactive cursor-following gradient - Enhanced */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(circle ${window.innerWidth < 768 ? '150px' : '300px'} at ${mousePos.x}px ${mousePos.y}px, rgba(249, 115, 22, 0.35) 0%, rgba(249, 115, 22, 0.15) 40%, rgba(249, 115, 22, 0.03) 70%, transparent 100%)`,
          transition: 'background 0.1s ease-out',
          zIndex: 1,
          filter: 'blur(12px)'
        }} />
        {/* Radial gradient burn effect - top right corner - Enhanced */}
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
        {/* Floating animated orbs - subtle background animation */}
        <motion.div
          className="absolute w-32 h-32 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(249, 115, 22, 0.15), rgba(249, 115, 22, 0.02))',
            top: '10%',
            left: '5%',
            filter: 'blur(40px)',
            zIndex: 0
          }}
          animate={{
            y: [0, 30, 0],
            x: [0, 15, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
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
          animate={{
            y: [0, -40, 0],
            x: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        />
        {/* Background decoration only - no animated nodes */}
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

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 lg:py-28 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="container">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto">
            <p className="text-orange-500 font-semibold text-sm mb-4">NEWLINK는</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              비즈니스 운영 파트너입니다
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
              광고 대행사처럼 일방적으로 광고만 집행하지 않습니다.
              <br />
              비즈니스 운영의 흐름을 함께 정리하고, 실제 성과를 만드는 파트너입니다.
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-12 flex justify-center"
            >
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663677784548/arS2DS4U34b8spGZTEQePD/illustration-consultation-3d-ECBgD4gnkf2WdektmnWhJM.webp"
                alt="Business Consultation"
                className="w-full max-w-2xl h-auto"
              />
            </motion.div>
          </motion.div>
        </div>
        {/* Scroll Down Arrow Button */}
        <motion.button
          onClick={() => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
              aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          animate={{
            y: [0, 12, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          type="button"
        >
          <p className="text-xs text-orange-500 font-medium">더 알아보기</p>
          <div className="w-6 h-10 border-2 border-orange-500 rounded-full flex items-center justify-center">
            <motion.div
              animate={{
                y: [0, 4, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="w-1 h-1 bg-orange-500 rounded-full"
            />
          </div>
        </motion.button>
      </section>

      {/* Problems Section */}
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

      {/* Process Section */}
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
            {/* Background Vertical Line - Perfectly Centered - Limited to 95% */}
            <div className="absolute left-1/2 top-0 w-1 bg-gray-200 transform -translate-x-1/2 z-0" style={{ height: '95%' }} />

            {/* Progress Vertical Line - Fills from top */}
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
                    {/* Left Side - Card or Empty Space */}
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

                    {/* Center - Timeline Node (Perfectly Centered) */}
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
                          {/* 부드러운 그라데이션 배경 원 */}
                          <motion.div
                            className="absolute w-10 h-10 sm:w-11 sm:h-11 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
                          />
                          {/* 외부 링 애니메이션 */}
                          <motion.div
                            className="absolute w-10 h-10 sm:w-11 sm:h-11 md:w-14 md:h-14 rounded-full border border-orange-400"
                            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.2, 0.8] }}
                            transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity }}
                          />
                          {/* 체크마크 - 세련된 스트로크 스타일 */}
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

                    {/* Right Side - Card or Empty Space */}
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

      {/* Services Section */}
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
                    <h3 className="text-sm sm:text-base md:text-lg font-extrabold text-gray-900 mb-2 sm:mb-3 md:mb-4 group-hover:text-orange-600 transition-colors duration-300 leading-tight">{service.title}</h3>
                    <p className="text-gray-600 text-xs sm:text-xs md:text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{service.description}</p>
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

      {/* Results Section - Story-Driven Case Studies */}
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
              {/* Tab Navigation - Minimal Style */}
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
                          {/* Primary Metric */}
                          <div>
                            <p className="text-xs sm:text-sm text-gray-500 font-medium mb-2 uppercase tracking-wide">{results[currentSlide].metric}</p>
                            <div className="flex items-baseline gap-3 sm:gap-4">
                              <p className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900">
                                {countedValues[`counter-${currentSlide}`] || 0}건
                              </p>
                              <p className="text-2xl sm:text-3xl font-bold text-orange-600">{results[currentSlide].improvement}</p>
                            </div>
                          </div>
                          
                          {/* Headline - Concrete Result */}
                          <div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-snug">
                              {results[currentSlide].description}
                            </h3>
                          </div>
                        </div>

                        {/* Right Column - Key Metrics Cards */}
                        <div className="lg:col-span-1 space-y-2">
                          {/* Duration Card */}
                          <div className="bg-white rounded-lg border border-gray-200 p-3 hover:border-orange-200 transition-colors">
                            <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">진행 기간</p>
                            <p className="text-base font-bold text-gray-900">{results[currentSlide].details?.duration}</p>
                          </div>
                          
                          {/* Total Traffic Card */}
                          <div className="bg-white rounded-lg border border-gray-200 p-3 hover:border-orange-200 transition-colors">
                            <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">총 유입</p>
                            <p className="text-base font-bold text-gray-900">{results[currentSlide].details?.totalTraffic}</p>
                          </div>
                          
                          {/* Total Reviews Card */}
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

      {/* Contact Section */}
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
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          <Check size={20} className="text-green-500" />
                        </motion.div>
                      )}
                      {formErrors.name && touched.name && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          <AlertCircle size={20} className="text-red-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {formErrors.name && touched.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2"
                      >
                        {formErrors.name}
                      </motion.p>
                    )}
                  </div>

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
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          <Check size={20} className="text-green-500" />
                        </motion.div>
                      )}
                      {formErrors.phone && touched.phone && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          <AlertCircle size={20} className="text-red-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {formErrors.phone && touched.phone && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2"
                      >
                        {formErrors.phone}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          <Check size={20} className="text-green-500" />
                        </motion.div>
                      )}
                      {formErrors.email && touched.email && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          <AlertCircle size={20} className="text-red-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {formErrors.email && touched.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2"
                      >
                        {formErrors.email}
                      </motion.p>
                    )}
                  </div>

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
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          <Check size={20} className="text-green-500" />
                        </motion.div>
                      )}
                      {formErrors.company && touched.company && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                          <AlertCircle size={20} className="text-red-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {formErrors.company && touched.company && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2"
                      >
                        {formErrors.company}
                      </motion.p>
                    )}
                  </div>
                </div>

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
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute right-4 top-6"
                      >
                        <Check size={20} className="text-green-500" />
                      </motion.div>
                    )}
                    {formErrors.message && touched.message && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute right-4 top-6"
                      >
                        <AlertCircle size={20} className="text-red-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {formErrors.message && touched.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-2"
                    >
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
                {/* 기대 효과 */}
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
                
                {/* 서비스 상세 */}
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

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 md:py-16 border-t border-gray-800">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left: Logo */}
            <div className="flex items-start">
              <img src="/images/logo-white.png" alt="NEWLINK" className="max-w-[120px] h-auto" />
            </div>
            
            {/* Right: Info */}
            <div className="text-left md:text-right space-y-3">
              {/* Row 1: Company Info */}
              <div className="text-xs leading-relaxed">
                <div className="flex flex-col md:flex-row md:justify-end gap-2 md:gap-3">
                  <span><span className="font-semibold text-gray-200">상호명:</span> <span className="text-gray-400">(주)뉴링크</span></span>
                  <span className="hidden md:inline text-gray-600">|</span>
                  <span><span className="font-semibold text-gray-200">대표자:</span> <span className="text-gray-400">유빈</span></span>
                  <span className="hidden md:inline text-gray-600">|</span>
                  <span><span className="font-semibold text-gray-200">사업자등록번호:</span> <span className="text-gray-400">405-86-03531</span></span>
                </div>
              </div>
              
              {/* Row 2: Address */}
              <div className="text-xs leading-relaxed">
                <span className="font-semibold text-gray-200">주소:</span> <span className="text-gray-400">06045 서울 강남구 강남대로132길 48 2층 201호</span>
              </div>
              
              {/* Row 3: Phone & Email */}
              <div className="text-xs leading-relaxed flex flex-col md:flex-row md:justify-end gap-2 md:gap-4">
                <span><span className="font-semibold text-gray-200">대표번호:</span> <span className="text-gray-400">070-4156-3684</span></span>
                <span className="hidden md:inline text-gray-600">|</span>
                <span><span className="font-semibold text-gray-200">이메일:</span> <span className="text-gray-400">contact@newlinkcorp.kr</span></span>
              </div>
              
              {/* Copyright */}
              <div className="pt-4 md:pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-500">© {new Date().getFullYear()} NEWLINK. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* 모바일 플로팅 CTA 버튼 */}
      <motion.button
        onClick={() => {
          const element = document.getElementById('contact');
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
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
