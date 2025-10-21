import { LearningPath } from '@/lib/hooks/useLearningPaths';
import { AITool } from '@/lib/hooks/useAITools';

// Mock AI Tools - ตรงกับคอร์สจริง
export const mockAITools: AITool[] = [
  {
    id: 'nano-banana',
    name: 'Nano Banana',
    folder: 'NANO BANANA',
    icon: '🍌',
    description: 'สร้างภาพนายแบบนางแบบ และแก้ไขภาพด้วย AI ขั้นเทพ',
    requiredPackage: 'basic',
    videos: [
      {
        id: 'nano-1',
        title: 'เริ่มต้นใช้งาน Nano Banana',
        driveId: 'EXAMPLE_DRIVE_ID_1',
        duration: '15:00',
        order: 1,
        description: 'พื้นฐานการใช้งาน Nano Banana สร้างภาพนายแบบนางแบบ'
      }
    ]
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    folder: 'MIDJOURNEY',
    icon: '🎨',
    description: 'สร้างภาพนายแบบนางแบบ และแก้ไขภาพด้วย Midjourney',
    requiredPackage: 'basic',
    videos: [
      {
        id: 'mj-1',
        title: 'เริ่มต้นใช้งาน Midjourney',
        driveId: 'EXAMPLE_DRIVE_ID_2',
        duration: '20:00',
        order: 1,
        description: 'พื้นฐานการสร้างภาพด้วย Midjourney'
      }
    ]
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    folder: 'GPT Custom',
    icon: '🤖',
    description: 'สร้างสคริปต์ คิดบทพูด และใช้เป็น AI ผู้ช่วย',
    requiredPackage: 'basic',
    videos: [
      {
        id: 'gpt-1',
        title: 'ใช้ ChatGPT คิดบทพูดโฆษณา',
        driveId: 'EXAMPLE_DRIVE_ID_3',
        duration: '18:00',
        order: 1,
        description: 'เทคนิคการใช้ ChatGPT เขียนสคริปต์โฆษณา'
      }
    ]
  },
  {
    id: 'google-ai-studio',
    name: 'Google AI Studio',
    folder: 'Google AI Studio',
    icon: '🎙️',
    description: 'พากย์เสียงฟรี และสร้างภาพฟรี 100% ไม่เสียเงิน',
    requiredPackage: 'basic',
    videos: [
      {
        id: 'gas-1',
        title: 'พากย์เสียงฟรีด้วย Google AI Studio',
        driveId: 'EXAMPLE_DRIVE_ID_4',
        duration: '12:00',
        order: 1,
        description: 'วิธีใช้ Google AI Studio พากย์เสียงแบบไม่เสียเงิน'
      }
    ]
  },
  {
    id: 'elevenlabs',
    name: 'Eleven Labs',
    folder: 'Eleven Labs',
    icon: '🔊',
    description: 'พากย์เสียงคุณภาพสูง (เสียเงินรายเดือน) และโคลนเสียงได้',
    requiredPackage: 'allinone',
    videos: [
      {
        id: 'el-1',
        title: 'พากย์เสียงด้วย Eleven Labs',
        driveId: 'EXAMPLE_DRIVE_ID_5',
        duration: '16:00',
        order: 1,
        description: 'การใช้ Eleven Labs พากย์เสียงและโคลนเสียง'
      }
    ]
  },
  {
    id: 'veo3',
    name: 'VEO 3.1',
    folder: 'VECO3',
    icon: '🎬',
    description: 'สร้างคลิป AI และฟุตเทจ AI คุณภาพสูง',
    requiredPackage: 'allinone',
    videos: [
      {
        id: 'veo-1',
        title: 'ปฐมบทการทำ VEO 3.1',
        driveId: 'EXAMPLE_DRIVE_ID_6',
        duration: '25:00',
        order: 1,
        description: 'เริ่มต้นสร้างคลิป AI ด้วย VEO 3.1'
      }
    ]
  },
  {
    id: 'sora2',
    name: 'Sora 2',
    folder: 'Sora 2',
    icon: '🌟',
    description: 'สร้างคลิป AI และฟุตเทจ AI จาก OpenAI',
    requiredPackage: 'allinone',
    videos: [
      {
        id: 'sora-1',
        title: 'เริ่มต้นใช้งาน Sora 2',
        driveId: 'EXAMPLE_DRIVE_ID_7',
        duration: '22:00',
        order: 1,
        description: 'พื้นฐานการสร้างวิดีโอด้วย Sora 2'
      }
    ]
  },
  {
    id: 'suno',
    name: 'Suno',
    folder: 'Suno',
    icon: '🎵',
    description: 'สร้างเพลงด้วย AI',
    requiredPackage: 'allinone',
    videos: [
      {
        id: 'suno-1',
        title: 'สร้างเพลงด้วย Suno',
        driveId: 'EXAMPLE_DRIVE_ID_8',
        duration: '18:00',
        order: 1,
        description: 'การใช้ Suno สร้างเพลงด้วย AI'
      }
    ]
  },
  {
    id: 'promptdee',
    name: 'Promptdee.net',
    folder: 'Promptdee',
    icon: '✨',
    description: 'สร้าง Prompt ภาษาไทย สำหรับ VEO3.1 และ Sora 2 ขั้นเทพ',
    requiredPackage: 'pro',
    videos: [
      {
        id: 'pd-1',
        title: 'ใช้ Promptdee สร้าง Prompt ขั้นเทพ',
        driveId: 'EXAMPLE_DRIVE_ID_9',
        duration: '20:00',
        order: 1,
        description: 'เทคนิคการใช้ Promptdee.net สร้าง Prompt ภาษาไทย'
      }
    ]
  },
  {
    id: 'infinite-talk',
    name: 'Infinite Talk (Comfy UI)',
    folder: 'Infinite Talk',
    icon: '💬',
    description: 'ลิปซิงค์ขั้นเทพสุด รันบน RunPod',
    requiredPackage: 'pro',
    videos: [
      {
        id: 'it-1',
        title: 'ลิปซิงค์ด้วย Infinite Talk',
        driveId: 'EXAMPLE_DRIVE_ID_10',
        duration: '30:00',
        order: 1,
        description: 'วิธีใช้ Infinite Talk รันบน Comfy UI (RunPod)'
      }
    ]
  },
  {
    id: 'dreamface',
    name: 'Dreamface',
    folder: 'Dreamface สิบชิ้นตี',
    icon: '😊',
    description: 'ลิปซิงค์แบบรวดเร็ว',
    requiredPackage: 'allinone',
    videos: [
      {
        id: 'df-1',
        title: 'ลิปซิงค์เร็วด้วย Dreamface',
        driveId: 'EXAMPLE_DRIVE_ID_11',
        duration: '15:00',
        order: 1,
        description: 'การใช้ Dreamface สำหรับลิปซิงค์แบบรวดเร็ว'
      }
    ]
  },
  {
    id: 'heygen',
    name: 'Heygen',
    folder: 'Heygen สิบชิ้นตี',
    icon: '👤',
    description: 'ลิปซิงค์และสร้าง AI Avatar',
    requiredPackage: 'allinone',
    videos: [
      {
        id: 'hg-1',
        title: 'ลิปซิงค์ด้วย Heygen',
        driveId: 'EXAMPLE_DRIVE_ID_12',
        duration: '18:00',
        order: 1,
        description: 'การใช้ Heygen สำหรับลิปซิงค์'
      }
    ]
  },
  {
    id: 'freepik',
    name: 'Freepik',
    folder: 'Freepik',
    icon: '🖼️',
    description: 'เครื่องมือออกแบบ (สำหรับคนที่มี package Freepik)',
    requiredPackage: 'allinone',
    videos: [
      {
        id: 'fp-1',
        title: 'ใช้งาน Freepik',
        driveId: 'EXAMPLE_DRIVE_ID_13',
        duration: '15:00',
        order: 1,
        description: 'การใช้ Freepik ออกแบบกราฟิก'
      }
    ]
  },
  {
    id: 'capcut',
    name: 'CapCut',
    folder: 'CapCut',
    icon: '✂️',
    description: 'ตัดต่อวิดีโอ รวมทุกอย่างเข้าด้วยกัน',
    requiredPackage: 'basic',
    videos: [
      {
        id: 'cc-1',
        title: 'ตัดต่อวิดีโอด้วย CapCut',
        driveId: 'EXAMPLE_DRIVE_ID_14',
        duration: '25:00',
        order: 1,
        description: 'การใช้ CapCut ตัดต่อและรวมวิดีโอ'
      }
    ]
  }
];

// Mock Learning Paths - ตรงกับคอร์สจริง
export const mockLearningPaths: LearningPath[] = [
  {
    id: 'intro-ads',
    title: '📺 ปฐมบทการทำโฆษณา',
    description: 'เรียนรู้พื้นฐานการทำโฆษณาด้วย AI ตั้งแต่เริ่มต้น',
    icon: '📺',
    level: 'เริ่มต้น',
    requiredPackage: 'basic',
    totalDuration: '1 ชั่วโมง',
    totalVideos: 1,
    toolsUsed: ['ChatGPT', 'Nano Banana', 'CapCut'],
    steps: [
      {
        order: 1,
        toolId: 'chatgpt',
        videoId: 'gpt-1',
        title: 'ปฐมบทการทำโฆษณา',
        description: 'เรียนรู้พื้นฐานการวางแผนและสร้างโฆษณา'
      }
    ]
  },
  {
    id: 'intro-veo3',
    title: '🎬 ปฐมบทการทำ VEO 3.1',
    description: 'เริ่มต้นสร้างคลิป AI ด้วย VEO 3.1',
    icon: '🎬',
    level: 'เริ่มต้น',
    requiredPackage: 'allinone',
    totalDuration: '30 นาที',
    totalVideos: 1,
    toolsUsed: ['VEO 3.1'],
    steps: [
      {
        order: 1,
        toolId: 'veo3',
        videoId: 'veo-1',
        title: 'ปฐมบทการทำ VEO 3.1',
        description: 'พื้นฐานการสร้างวิดีโอด้วย VEO 3.1'
      }
    ]
  },
  {
    id: 'full-ads-workflow',
    title: '🎯 โฆษณาปิดตระกร้า (Full Workflow)',
    description: 'เรียนรู้ทุกขั้นตอนการสร้างโฆษณาครบวงจร ตั้งแต่คิดบทพูด สร้างนางแบบ ลิปซิงค์ จนถึงตัดต่อเสร็จสมบูรณ์',
    icon: '🎯',
    level: 'กลาง',
    requiredPackage: 'pro',
    totalDuration: '4 ชั่วโมง',
    totalVideos: 7,
    toolsUsed: ['ChatGPT', 'Eleven Labs', 'Google AI Studio', 'Nano Banana', 'Infinite Talk', 'VEO 3.1', 'Sora 2', 'CapCut'],
    steps: [
      {
        order: 1,
        toolId: 'chatgpt',
        videoId: 'gpt-1',
        title: 'ขั้นที่ 1: คิดบทพูดด้วย ChatGPT',
        description: 'ใช้ ChatGPT ช่วยเขียนสคริปต์โฆษณาที่น่าสนใจ'
      },
      {
        order: 2,
        toolId: 'elevenlabs',
        videoId: 'el-1',
        title: 'ขั้นที่ 2: พากย์เสียง (Eleven Labs)',
        description: 'พากย์เสียงคุณภาพสูงด้วย Eleven Labs (แบบเสียเงิน)'
      },
      {
        order: 3,
        toolId: 'google-ai-studio',
        videoId: 'gas-1',
        title: 'ขั้นที่ 2 (ทางเลือก): พากย์เสียงฟรี',
        description: 'พากย์เสียงฟรีด้วย Google AI Studio'
      },
      {
        order: 4,
        toolId: 'nano-banana',
        videoId: 'nano-1',
        title: 'ขั้นที่ 3: สร้างนางแบบถือสินค้า',
        description: 'ใช้ Nano Banana สร้างนางแบบที่ถือสินค้าของเรา'
      },
      {
        order: 5,
        toolId: 'infinite-talk',
        videoId: 'it-1',
        title: 'ขั้นที่ 4: ลิปซิงค์ขั้นเทพ',
        description: 'รวมรูป + เสียงด้วย Infinite Talk บน Comfy UI'
      },
      {
        order: 6,
        toolId: 'veo3',
        videoId: 'veo-1',
        title: 'ขั้นที่ 5: สร้างฟุตเทจด้วย VEO3',
        description: 'สร้างฟุตเทจเพิ่มเติมด้วย VEO 3.1'
      },
      {
        order: 7,
        toolId: 'capcut',
        videoId: 'cc-1',
        title: 'ขั้นที่ 6: ตัดต่อรวมทุกอย่าง',
        description: 'ใช้ CapCut รวมทุกอย่างเป็นโฆษณาสมบูรณ์'
      }
    ]
  },
  {
    id: 'lipsync-3-ways',
    title: '💋 ลิปซิงค์ขั้นเทพ 3 แบบ',
    description: 'เปรียบเทียบ 3 วิธีลิปซิงค์ ตั้งแต่เทพสุดจนถึงรวดเร็ว',
    icon: '💋',
    level: 'กลาง',
    requiredPackage: 'pro',
    totalDuration: '1.5 ชั่วโมง',
    totalVideos: 3,
    toolsUsed: ['Infinite Talk', 'Dreamface', 'Heygen'],
    steps: [
      {
        order: 1,
        toolId: 'infinite-talk',
        videoId: 'it-1',
        title: 'แบบที่ 1: Infinite Talk (เทพสุด)',
        description: 'ลิปซิงค์คุณภาพสูงสุด รันบน Comfy UI'
      },
      {
        order: 2,
        toolId: 'dreamface',
        videoId: 'df-1',
        title: 'แบบที่ 2: Dreamface (รวดเร็ว)',
        description: 'ลิปซิงค์แบบเร็วและใช้งานง่าย'
      },
      {
        order: 3,
        toolId: 'heygen',
        videoId: 'hg-1',
        title: 'แบบที่ 3: Heygen',
        description: 'ลิปซิงค์แบบสมดุล'
      }
    ]
  }
];

// Helper functions
export function getAIToolById(id: string): AITool | undefined {
  return mockAITools.find((tool) => tool.id === id);
}

export function getLearningPathById(id: string): LearningPath | undefined {
  return mockLearningPaths.find((path) => path.id === id);
}

export function getVideoById(videoId: string) {
  for (const tool of mockAITools) {
    const video = tool.videos.find((v) => v.id === videoId);
    if (video) {
      return { video, tool };
    }
  }
  return null;
}
