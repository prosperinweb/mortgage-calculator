"use client"

import { useState, useEffect } from "react"

export function useSliderPreference() {
  const [showSliders, setShowSliders] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("showSliders")
    setShowSliders(stored === null ? true : stored === "true")
    setIsLoaded(true)
  }, [])

  const toggleSliders = (value: boolean) => {
    setShowSliders(value)
    localStorage.setItem("showSliders", String(value))
  }

  return { showSliders, toggleSliders, isLoaded }
}