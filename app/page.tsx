import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Prompt D Academy
              </span>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="btn-primary"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            เรียนรู้ AI แบบมืออาชีพ
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-purple-100">
            เลือกเส้นทางการเรียนที่เหมาะกับคุณ หรือเรียนรู้แต่ละ AI Tool แยกกัน
          </p>
          <div className="flex gap-4 justify-center">
            <a href="https://m.me/719837687869400" target="_blank" rel="noopener noreferrer" className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors text-lg">
              สอบถามและสมัครคอร์ส
            </a>
          </div>
        </div>
      </section>

      {/* AI Tools Infinite Carousel */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-4">เรียนรู้ AI Tools ชั้นนำ</h2>
          <p className="text-center text-gray-600 mb-12">ปลดล็อกพลังของ AI ชั้นนำระดับโลก</p>
        </div>

        {/* Infinite Scrolling Logos */}
        <div className="relative">
          <div className="flex animate-scroll">
            {/* First set of logos */}
            <div className="flex gap-8 px-4">
              <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-4 shadow-md whitespace-nowrap">
                <span className="text-3xl">🎬</span>
                <span className="font-bold text-gray-800">VEO 3.1</span>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-4 shadow-md whitespace-nowrap">
                <span className="text-3xl">🍌</span>
                <span className="font-bold text-gray-800">Nano Banana</span>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-4 shadow-md whitespace-nowrap">
                <span className="text-3xl">🤖</span>
                <span className="font-bold text-gray-800">ChatGPT</span>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-4 shadow-md whitespace-nowrap">
                <span className="text-3xl">💬</span>
                <span className="font-bold text-gray-800">Infinite Talk</span>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-4 shadow-md whitespace-nowrap">
                <span className="text-3xl">🎨</span>
                <span className="font-bold text-gray-800">Midjourney</span>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-4 shadow-md whitespace-nowrap">
                <span className="text-3xl">🧠</span>
                <span className="font-bold text-gray-800">Claude AI</span>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-4 shadow-md whitespace-nowrap">
                <span className="text-3xl">✨</span>
                <span className="font-bold text-gray-800">Gemini</span>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-4 shadow-md whitespace-nowrap">
                <span className="text-3xl">🎵</span>
                <span className="font-bold text-gray-800">Suno AI</span>
              </div>
            </div>

            {/* Duplicate set for seamless loop */}
            <div className="flex gap-8 px-4">
              <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-4 shadow-md whitespace-nowrap">
                <span className="text-3xl">🎬</span>
                <span className="font-bold text-gray-800">VEO 3.1</span>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-4 shadow-md whitespace-nowrap">
                <span className="text-3xl">🍌</span>
                <span className="font-bold text-gray-800">Nano Banana</span>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-4 shadow-md whitespace-nowrap">
                <span className="text-3xl">🤖</span>
                <span className="font-bold text-gray-800">ChatGPT</span>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-4 shadow-md whitespace-nowrap">
                <span className="text-3xl">💬</span>
                <span className="font-bold text-gray-800">Infinite Talk</span>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-4 shadow-md whitespace-nowrap">
                <span className="text-3xl">🎨</span>
                <span className="font-bold text-gray-800">Midjourney</span>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-4 shadow-md whitespace-nowrap">
                <span className="text-3xl">🧠</span>
                <span className="font-bold text-gray-800">Claude AI</span>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-4 shadow-md whitespace-nowrap">
                <span className="text-3xl">✨</span>
                <span className="font-bold text-gray-800">Gemini</span>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg px-6 py-4 shadow-md whitespace-nowrap">
                <span className="text-3xl">🎵</span>
                <span className="font-bold text-gray-800">Suno AI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">แพ็คเกจเรียน</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Package */}
            <div className="card hover:shadow-2xl">
              <h3 className="text-2xl font-bold mb-2">Beginner</h3>
              <div className="mb-4">
                <div className="text-3xl font-bold text-purple-600">฿299</div>
                <div className="text-sm text-gray-400 line-through">฿499</div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>สร้างวิดีโอโฆษณาด้วย AI</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>ChatGPT, Nano Banana, Veo3.1, Infinite talk</span>
                </li>
              </ul>
              <a href="https://m.me/719837687869400" target="_blank" rel="noopener noreferrer" className="btn-primary w-full block text-center">เลือกแพ็คเกจนี้</a>
            </div>

            {/* All-in-One Package */}
            <div className="card hover:shadow-2xl border-purple-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                แนะนำ
              </div>
              <h3 className="text-2xl font-bold mb-2">All-in-One</h3>
              <div className="mb-4">
                <div className="text-3xl font-bold text-purple-600">฿499</div>
                <div className="text-sm text-gray-400 line-through">฿999</div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>คอร์สทั้งหมดในแพ็คเกจ Basic</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>ออกแบบโฆษณา Product</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>สร้างเพลงและนิทานด้วย AI</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>สอนใช้ AI ตัวอื่นๆอีกเพียบ</span>
                </li>
              </ul>
              <a href="https://m.me/719837687869400" target="_blank" rel="noopener noreferrer" className="btn-primary w-full block text-center">เลือกแพ็คเกจนี้</a>
            </div>

            {/* Pro Package */}
            <div className="card hover:shadow-2xl">
              <h3 className="text-2xl font-bold mb-2">Pro Developer</h3>
              <div className="mb-4">
                <div className="text-3xl font-bold text-purple-600">฿1,499</div>
                <div className="text-sm text-gray-400 line-through">฿2,499</div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>เรียนรู้การพัฒนาด้วย AI</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>สร้างเว็บไซต์ด้วย AI</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>สร้าง Automation ระบบ</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>เหมาะสำหรับนักพัฒนา</span>
                </li>
              </ul>
              <a href="https://m.me/719837687869400" target="_blank" rel="noopener noreferrer" className="btn-primary w-full block text-center">เลือกแพ็คเกจนี้</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="w-6 h-6" />
            <span className="text-xl font-bold">Prompt D Academy</span>
          </div>
          <p className="text-gray-400">
            © 2025 Prompt D Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
