"use client"

import Image from "next/image"
import React from "react"

const images = [
  "/landing/1.jpg",
  "/landing/2.jpg",
  "/landing/3.jpg",
  "/landing/4.jpg",
  "/landing/5.jpg",
  "/landing/6.jpg",
]

const rows = 3
const imageSize = 100
const gapPx = 16

function getRowImages() {
  const tripled = [...images, ...images, ...images]
  const imagesPerRow = Math.ceil(tripled.length / rows)
  const result = []
  for (let i = 0; i < rows; i++) {
    const start = i * imagesPerRow
    const end = start + imagesPerRow
    result.push(tripled.slice(start, end))
  }
  return result
}

const leftRows = getRowImages()
const rightRows = getRowImages()

export default function CarouselSide() {
  return (
    <>
      {/* Carrusel izquierdo */}
      <div
        className="hidden md:flex flex-col absolute top-0 bottom-0 left-0 w-[22%] h-[60%] overflow-hidden pointer-events-none"
        style={{ padding: gapPx / 2 }}
      >
        {leftRows.map((rowImages, i) => (
          <div
            key={`left-row-${i}`}
            className={`flex flex-row gap-4 whitespace-nowrap ${
              i % 2 === 0 ? "animate-carousel-left" : "animate-carousel-right"
            }`}
            style={{
              width: "240%",
              marginBottom: gapPx / 2,
              animationDuration: "15s",
              willChange: "transform",
            }}
          >
            {rowImages.map((src, j) => (
              <Image
                key={`left-img-${i}-${j}`}
                src={src}
                alt={`left-img-${i}-${j}`}
                width={imageSize}
                height={imageSize}
                className="rounded-xl object-cover opacity-40 hover:opacity-60 transition duration-300"
                draggable={false}
              />
            ))}
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 60,
            height: "100%",
            pointerEvents: "none",
            background: "linear-gradient(to left, rgba(243,240,235,1), rgba(243,240,235,0))",
          }}
        />
      </div>

      {/* Carrusel derecho */}
      <div
        className="hidden md:flex flex-col absolute top-0 bottom-0 right-0 w-[22%] h-[60%] overflow-hidden pointer-events-none"
        style={{ padding: gapPx / 2 }}
      >
        {rightRows.map((rowImages, i) => (
          <div
            key={`right-row-${i}`}
            className={`flex flex-row gap-4 whitespace-nowrap ${
              i % 2 === 0 ? "animate-carousel-right" : "animate-carousel-left"
            }`}
            style={{
              width: "240%",
              marginBottom: gapPx / 2,
              animationDuration: "15s",
              willChange: "transform",
            }}
          >
            {rowImages.map((src, j) => (
              <Image
                key={`right-img-${i}-${j}`}
                src={src}
                alt={`right-img-${i}-${j}`}
                width={imageSize}
                height={imageSize}
                className="rounded-xl object-cover opacity-40 hover:opacity-60 transition duration-300"
                draggable={false}
              />
            ))}
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 60,
            height: "100%",
            pointerEvents: "none",
            background: "linear-gradient(to right, rgba(243,240,235,1), rgba(243,240,235,0))",
          }}
        />
      </div>
    </>
  )
}
