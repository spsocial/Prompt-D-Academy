'use client'

import Link from 'next/link'
import Script from 'next/script'

export default function Home() {
  return (
    <>
      <Script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js" />
      <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
        {/* Navigation */}
        <nav className="bg-white/90 backdrop-blur-md shadow-sm fixed top-0 w-full z-50 border-b border-purple-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <img src="/images/logo_1.png" alt="Prompt D Academy Logo" className="w-12 h-12 object-contain" />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Prompt D Academy
                </span>
              </div>
              <div className="flex gap-4">
                <Link
                  href="/login"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-bold hover:shadow-lg hover:shadow-purple-300 transition-all hover:-translate-y-0.5"
                >
                  เข้าสู่ระบบ
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
              <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-full mb-8 shadow-lg">
              <span className="text-white font-bold text-sm tracking-wider">🚀 AI EDUCATION</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                เรียนรู้ AI แบบมืออาชีพ
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-12 text-gray-700 max-w-3xl mx-auto">
              เลือกเส้นทางการเรียนที่เหมาะกับคุณ หรือเรียนรู้แต่ละ AI Tool แยกกัน
              <br />
              <span className="text-purple-600 font-semibold">สอนโดยผู้เชี่ยวชาญด้าน AI จริง</span>
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="https://m.me/719837687869400"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-purple-300 transition-all hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10">สอบถามและสมัครคอร์ส</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-8 h-12 border-2 border-purple-500 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-purple-500 rounded-full animate-scroll"></div>
            </div>
          </div>
        </section>

        {/* AI Tools Infinite Carousel */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 flex items-center justify-center gap-4">
              <lottie-player
                src="/images/ai-tools.json"
                background="transparent"
                speed="1"
                style={{ width: '60px', height: '60px' }}
                loop
                autoplay
              />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                เรียนรู้ AI Tools ชั้นนำ
              </span>
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              ปลดล็อกพลังของ AI ชั้นนำระดับโลก
            </p>
          </div>

          {/* Infinite Scrolling Logos */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll">
              {/* First set of logos */}
              <div className="flex gap-8 px-4">
                <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-5 py-3 shadow-md hover:shadow-xl hover:border-purple-400 hover:shadow-purple-200/50 transition-all whitespace-nowrap group">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <img src="/images/veo.png" alt="VEO 3.1" className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
                    <span className="text-2xl hidden">🎬</span>
                  </div>
                  <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">VEO 3.1</span>
                </div>
                <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-5 py-3 shadow-md hover:shadow-xl hover:border-purple-400 hover:shadow-purple-200/50 transition-all whitespace-nowrap group">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <img src="/images/chatgpt.png" alt="ChatGPT" className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
                    <span className="text-2xl hidden">🤖</span>
                  </div>
                  <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">ChatGPT</span>
                </div>
                <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-5 py-3 shadow-md hover:shadow-xl hover:border-purple-400 hover:shadow-purple-200/50 transition-all whitespace-nowrap group">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <img src="/images/gemini.png" alt="Gemini" className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
                    <span className="text-2xl hidden">✨</span>
                  </div>
                  <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">Gemini</span>
                </div>
                <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-5 py-3 shadow-md hover:shadow-xl hover:border-purple-400 hover:shadow-purple-200/50 transition-all whitespace-nowrap group">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <img src="/images/midjourney.png" alt="Midjourney" className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
                    <span className="text-2xl hidden">🎨</span>
                  </div>
                  <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">Midjourney</span>
                </div>
                <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-5 py-3 shadow-md hover:shadow-xl hover:border-purple-400 hover:shadow-purple-200/50 transition-all whitespace-nowrap group">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <img src="/images/claude.png" alt="Claude AI" className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
                    <span className="text-2xl hidden">🧠</span>
                  </div>
                  <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">Claude AI</span>
                </div>
                <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-5 py-3 shadow-md hover:shadow-xl hover:border-purple-400 hover:shadow-purple-200/50 transition-all whitespace-nowrap group">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <img src="/images/comfyui.png" alt="Comfy UI" className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
                    <span className="text-2xl hidden">🎭</span>
                  </div>
                  <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">Comfy UI</span>
                </div>
                <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-5 py-3 shadow-md hover:shadow-xl hover:border-purple-400 hover:shadow-purple-200/50 transition-all whitespace-nowrap group">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <img src="/images/suno.png" alt="Suno AI" className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
                    <span className="text-2xl hidden">🎵</span>
                  </div>
                  <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">Suno AI</span>
                </div>
                <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-5 py-3 shadow-md hover:shadow-xl hover:border-purple-400 hover:shadow-purple-200/50 transition-all whitespace-nowrap group">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <img src="/images/elevenlabs.png" alt="ElevenLabs" className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
                    <span className="text-2xl hidden">🎙️</span>
                  </div>
                  <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">ElevenLabs</span>
                </div>
              </div>

              {/* Duplicate set for seamless loop */}
              <div className="flex gap-8 px-4">
                <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-5 py-3 shadow-md hover:shadow-xl hover:border-purple-400 hover:shadow-purple-200/50 transition-all whitespace-nowrap group">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <img src="/images/veo.png" alt="VEO 3.1" className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
                    <span className="text-2xl hidden">🎬</span>
                  </div>
                  <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">VEO 3.1</span>
                </div>
                <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-5 py-3 shadow-md hover:shadow-xl hover:border-purple-400 hover:shadow-purple-200/50 transition-all whitespace-nowrap group">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <img src="/images/nano-banana.png" alt="Nano Banana" className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
                    <span className="text-2xl hidden">🍌</span>
                  </div>
                  <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">Nano Banana</span>
                </div>
                <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-5 py-3 shadow-md hover:shadow-xl hover:border-purple-400 hover:shadow-purple-200/50 transition-all whitespace-nowrap group">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <img src="/images/chatgpt.png" alt="ChatGPT" className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
                    <span className="text-2xl hidden">🤖</span>
                  </div>
                  <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">ChatGPT</span>
                </div>
                <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-5 py-3 shadow-md hover:shadow-xl hover:border-purple-400 hover:shadow-purple-200/50 transition-all whitespace-nowrap group">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <img src="/images/infinite-talk.png" alt="Infinite Talk" className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
                    <span className="text-2xl hidden">💬</span>
                  </div>
                  <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">Infinite Talk</span>
                </div>
                <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-5 py-3 shadow-md hover:shadow-xl hover:border-purple-400 hover:shadow-purple-200/50 transition-all whitespace-nowrap group">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <img src="/images/midjourney.png" alt="Midjourney" className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
                    <span className="text-2xl hidden">🎨</span>
                  </div>
                  <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">Midjourney</span>
                </div>
                <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-5 py-3 shadow-md hover:shadow-xl hover:border-purple-400 hover:shadow-purple-200/50 transition-all whitespace-nowrap group">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <img src="/images/claude.png" alt="Claude AI" className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
                    <span className="text-2xl hidden">🧠</span>
                  </div>
                  <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">Claude AI</span>
                </div>
                <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-5 py-3 shadow-md hover:shadow-xl hover:border-purple-400 hover:shadow-purple-200/50 transition-all whitespace-nowrap group">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <img src="/images/gemini.png" alt="Gemini" className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
                    <span className="text-2xl hidden">✨</span>
                  </div>
                  <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">Gemini</span>
                </div>
                <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-5 py-3 shadow-md hover:shadow-xl hover:border-purple-400 hover:shadow-purple-200/50 transition-all whitespace-nowrap group">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <img src="/images/suno.png" alt="Suno AI" className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
                    <span className="text-2xl hidden">🎵</span>
                  </div>
                  <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">Suno AI</span>
                </div>
                <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-5 py-3 shadow-md hover:shadow-xl hover:border-purple-400 hover:shadow-purple-200/50 transition-all whitespace-nowrap group">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                    <img src="/images/elevenlabs.png" alt="ElevenLabs" className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
                    <span className="text-2xl hidden">🎙️</span>
                  </div>
                  <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">ElevenLabs</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Coaches Section - Inspired by MCN */}
        <section className="py-20 bg-gradient-to-b from-gray-50 via-purple-50/30 to-gray-100 relative overflow-hidden border-t border-gray-200 shadow-inner">
          {/* Background Effect */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-4">
                <lottie-player
                  src="/images/coach.json"
                  background="transparent"
                  speed="1"
                  style={{ width: '50px', height: '50px' }}
                  loop
                  autoplay
                />
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  พบกับโค้ชของเรา
                </span>
              </h2>
              <p className="text-gray-600 text-lg">
                ผู้เชี่ยวชาญด้าน AI และการสร้างคอนเทนต์
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-center">
              {/* Left Preview - Screenshot 1 */}
              <div className="group relative bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-purple-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                <div className="relative aspect-[3/4] bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl opacity-20">📱</span>
                  </div>
                  <img
                    src="/images/show1.png"
                    alt="ตัวอย่างหน้าเว็บภายใน 1"
                    className="w-full h-full object-cover relative z-10"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
                <div className="p-4 text-center bg-gradient-to-r from-purple-50 to-pink-50">
                  <p className="text-sm font-semibold text-gray-700">เนื้อหาเรียงระบบ</p>
                  <p className="text-xs text-gray-600">แยกหมวดหมู่ชัดเจน</p>
                </div>
              </div>

              {/* Center - Coach FILM */}
              <div className="group relative bg-white rounded-3xl overflow-hidden border-2 border-gray-200 hover:border-purple-400 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-300/50 hover:scale-105 shadow-xl">
                {/* Top Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                {/* Image Container - 4:5 aspect ratio */}
                <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl opacity-20">👨‍🏫</span>
                  </div>
                  <img
                    src="/images/coach-film.jpg"
                    alt="Coach FILM"
                    className="w-full h-full object-cover relative z-10 group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>

                {/* Info Container */}
                <div className="p-8">
                  <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Coach FILM
                  </h3>
                  <p className="text-purple-600 font-bold mb-4 text-lg">
                    📹 ผู้เชี่ยวชาญด้านการทำคลิป AI
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    สอนการสร้างคลิปทุกรูปแบบด้วย AI ตั้งแต่พื้นฐานจนถึงขั้นสูง
                    ใช้เครื่องมือ ChatGPT, Veo3.1, ElevenLabs, Comfy UI และอื่นๆอีกมากมาย
                    และยังมีสอนการใช้ n8n อีกด้วยรวมถึงการตัดต่อด้วย CapCut
                    จบคอร์สที่เราเอาไปต่อยอดได้แน่นอน
                  </p>
                </div>
              </div>

              {/* Right Preview - Screenshot 2 */}
              <div className="group relative bg-white rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-purple-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                <div className="relative aspect-[3/4] bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl opacity-20">🎓</span>
                  </div>
                  <img
                    src="/images/show2.png"
                    alt="ตัวอย่างหน้าเว็บภายใน 2"
                    className="w-full h-full object-cover relative z-10"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
                <div className="p-4 text-center bg-gradient-to-r from-purple-50 to-pink-50">
                  <p className="text-sm font-semibold text-gray-700">เรียนง่าย ทำตาม</p>
                  <p className="text-xs text-gray-600">มีวิดีโอสอนทุกขั้นตอน</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-gradient-to-b from-gray-100 via-purple-50/20 to-white relative border-t border-gray-300">
          {/* Decorative top border */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 flex items-center justify-center gap-4">
              <lottie-player
                src="/images/pricing.json"
                background="transparent"
                speed="1"
                style={{ width: '60px', height: '60px' }}
                loop
                autoplay
              />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                แพ็คเกจเรียน
              </span>
            </h2>
            <p className="text-center text-gray-600 mb-16 text-lg">
              เลือกแพ็คเกจที่เหมาะกับคุณและเริ่มต้นเรียนรู้วันนี้
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Basic Package */}
              <div className="group relative bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-200/50 shadow-lg">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Beginner</h3>
                <div className="mb-6">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">฿299</div>
                  <div className="text-sm text-gray-500 line-through">฿499</div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="text-purple-600 text-xl">✓</span>
                    <span>สร้างวิดีโอโฆษณาด้วย AI</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="text-purple-600 text-xl">✓</span>
                    <span>ChatGPT, Nano Banana, Veo3.1, Infinite talk</span>
                  </li>
                </ul>
                <a
                  href="https://m.me/719837687869400"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full font-bold text-center hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  เลือกแพ็คเกจนี้
                </a>
              </div>

              {/* All-in-One Package */}
              <div className="group relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-400 hover:border-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-400/50 transform -translate-y-2 shadow-xl">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  แนะนำ
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">All-in-One</h3>
                <div className="mb-6">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">฿499</div>
                  <div className="text-sm text-gray-500 line-through">฿999</div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="text-purple-600 text-xl">✓</span>
                    <span>คอร์สทั้งหมดในแพ็คเกจ Basic</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="text-purple-600 text-xl">✓</span>
                    <span>ออกแบบโฆษณา Product</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="text-purple-600 text-xl">✓</span>
                    <span>สร้างเพลงและนิทานด้วย AI</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="text-purple-600 text-xl">✓</span>
                    <span>สอนใช้ AI ตัวอื่นๆอีกเพียบ</span>
                  </li>
                </ul>
                <a
                  href="https://m.me/719837687869400"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full font-bold text-center hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  เลือกแพ็คเกจนี้
                </a>
              </div>

              {/* Pro Package */}
              <div className="group relative bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-200/50 shadow-lg">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Pro Developer</h3>
                <div className="mb-6">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">฿1,499</div>
                  <div className="text-sm text-gray-500 line-through">฿2,499</div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="text-purple-600 text-xl">✓</span>
                    <span>เรียนรู้การพัฒนาด้วย AI</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="text-purple-600 text-xl">✓</span>
                    <span>สร้างเว็บไซต์ด้วย AI</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="text-purple-600 text-xl">✓</span>
                    <span>สร้าง Automation ระบบ</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <span className="text-purple-600 text-xl">✓</span>
                    <span>เหมาะสำหรับนักพัฒนา</span>
                  </li>
                </ul>
                <a
                  href="https://m.me/719837687869400"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full font-bold text-center hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  เลือกแพ็คเกจนี้
                </a>
              </div>
            </div>
        </div>
      </section>

        {/* Footer */}
        <footer className="bg-gradient-to-b from-white to-gray-100 border-t-2 border-gray-300 py-12 shadow-inner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src="/images/logo_1.png" alt="Prompt D Academy Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Prompt D Academy
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              © 2025 Prompt D Academy. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              เรียนรู้ AI กับผู้เชี่ยวชาญที่มีประสบการณ์จริง
            </p>
          </div>
        </footer>
      </main>
    </>
  )
}
