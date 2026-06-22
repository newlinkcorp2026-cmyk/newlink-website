export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 md:py-16 border-t border-gray-800">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex items-start">
            <img src="/images/logo-white.png" alt="NEWLINK" className="max-w-[120px] h-auto" />
          </div>

          <div className="text-left md:text-right space-y-3">
            <div className="text-xs leading-relaxed">
              <div className="flex flex-col md:flex-row md:justify-end gap-2 md:gap-3">
                <span><span className="font-semibold text-gray-200">상호명:</span> <span className="text-gray-400">(주)뉴링크</span></span>
                <span className="hidden md:inline text-gray-600">|</span>
                <span><span className="font-semibold text-gray-200">대표자:</span> <span className="text-gray-400">유빈</span></span>
                <span className="hidden md:inline text-gray-600">|</span>
                <span><span className="font-semibold text-gray-200">사업자등록번호:</span> <span className="text-gray-400">405-86-03531</span></span>
              </div>
            </div>

            <div className="text-xs leading-relaxed">
              <span className="font-semibold text-gray-200">주소:</span>{" "}
              <span className="text-gray-400">06045 서울 강남구 강남대로132길 48 2층 201호</span>
            </div>

            <div className="text-xs leading-relaxed flex flex-col md:flex-row md:justify-end gap-2 md:gap-4">
              <span><span className="font-semibold text-gray-200">대표번호:</span> <span className="text-gray-400">070-4156-3684</span></span>
              <span className="hidden md:inline text-gray-600">|</span>
              <span><span className="font-semibold text-gray-200">이메일:</span> <span className="text-gray-400">contact@newlinkcorp.kr</span></span>
            </div>

            <div className="pt-4 md:pt-6 border-t border-gray-800">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} NEWLINK. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}