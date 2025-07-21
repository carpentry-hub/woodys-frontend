import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Biblioteca En Madera Maciza - Woody's Workshop",
  description:
    "Elegante biblioteca de madera maciza con diseño minimalista y nórdico. Proyecto gratuito para construir.",
  keywords: "madera, biblioteca, DIY, woodworking, minimalista, nórdico",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
