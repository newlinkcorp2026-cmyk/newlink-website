import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true, margin: "0px 0px -100px 0px" },
};

export default function AboutSection() {
  return (
    <>
      {/* About Section */}
      <section
        id="about"
        className="py-16 md:py-24 lg:py-28 bg-gradient-to-b from-gray-50/50 to-white"
      >
        <div className="container">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto">
            <p className="text-orange-500 font-semibold text-sm mb-4">
              NEWLINK는
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6">
              비즈니스 운영 파트너입니다
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
              광고 대행사처럼 일방적으로 광고만 집행하지 않습니다.
              <br />
              비즈니스 운영의 흐름을 함께 정리하고, 실제 성과를 만드는
              파트너입니다.
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

        <motion.button
          onClick={() => {
            const aboutSection = document.getElementById("about");
            if (aboutSection) {
              aboutSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          animate={{
            y: [0, 12, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
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
                ease: "easeInOut",
              }}
              className="w-1 h-1 bg-orange-500 rounded-full"
            />
          </div>
        </motion.button>
      </section>
    </>
  );
}