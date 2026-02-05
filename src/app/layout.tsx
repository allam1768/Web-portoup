// 1. Import di paling atas
import { Raleway } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '../components/LayoutWrapper'

// 2. Inisialisasi di luar komponen (Server Scope)
const raleway = Raleway({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  display: 'swap' 
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${raleway.className} bg-[#121212] text-white`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}
