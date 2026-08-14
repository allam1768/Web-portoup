// 1. Import di paling atas
import { Rakkas, Montserrat_Alternates, Raleway } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '../components/LayoutWrapper'
import Cursor from '../components/Cursor'
import SmoothScroll from '../components/SmoothScroll'

// 2. Inisialisasi di luar komponen (Server Scope)
const rakkas = Rakkas({ 
  subsets: ['latin'], 
  weight: ['400'],
  variable: '--font-rakkas',
  display: 'swap' 
})

const montserratAlternates = Montserrat_Alternates({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat-alternates',
  display: 'swap' 
})

const raleway = Raleway({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-raleway',
  display: 'swap' 
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat+Subrayada:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${montserratAlternates.className} ${rakkas.variable} ${montserratAlternates.variable} ${raleway.variable} bg-[#121212] text-white`}>
        <LayoutWrapper>
           <SmoothScroll />
           <Cursor /> 
           {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}
