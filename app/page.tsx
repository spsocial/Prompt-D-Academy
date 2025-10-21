import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Zap className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Prompt D Academy
              </span>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="btn-primary"
              >
                สมัครสมาชิก
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
            <Link href="/register" className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              เริ่มต้นเรียนฟรี
            </Link>
            <Link href="/login" className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-purple-600 transition-colors">
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">เรียนรู้ AI Tools ชั้นนำ</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">ChatGPT & GPT Custom</h3>
              <p className="text-gray-600">สร้าง AI Assistant ของคุณเอง</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2">Midjourney</h3>
              <p className="text-gray-600">สร้างภาพสวยงามด้วย AI</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="text-xl font-bold mb-2">Heygen & Comfy UI</h3>
              <p className="text-gray-600">สร้างวิดีโอและ AI Avatar</p>
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
              <h3 className="text-2xl font-bold mb-2">โฆษณาโปร</h3>
              <div className="text-3xl font-bold text-purple-600 mb-4">
                ฿299
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>สร้างวิดีโอโฆษณาด้วย AI</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>ChatGPT, Midjourney, Heygen</span>
                </li>
              </ul>
              <button className="btn-primary w-full">เลือกแพ็คเกจนี้</button>
            </div>

            {/* All-in-One Package */}
            <div className="card hover:shadow-2xl border-purple-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                แนะนำ
              </div>
              <h3 className="text-2xl font-bold mb-2">All-in-One</h3>
              <div className="text-3xl font-bold text-purple-600 mb-4">
                ฿499
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
                  <span>สร้าง TikTok Viral</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>สร้างเพลงและนิทานด้วย AI</span>
                </li>
              </ul>
              <button className="btn-primary w-full">เลือกแพ็คเกจนี้</button>
            </div>

            {/* Pro Package */}
            <div className="card hover:shadow-2xl">
              <h3 className="text-2xl font-bold mb-2">Pro Developer</h3>
              <div className="text-3xl font-bold text-purple-600 mb-4">
                ฿999
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>ทุกอย่างใน All-in-One</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>สร้างเว็บไซต์ด้วย AI</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>สร้าง Automation ระบบ</span>
                </li>
              </ul>
              <button className="btn-secondary w-full">เร็วๆ นี้</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-6 h-6" />
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
