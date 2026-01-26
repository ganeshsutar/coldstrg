import { useEffect, useState } from "react"

export type ThemeMode = "light" | "dark" | "system"
export type NeutralColor = "gray" | "zinc" | "neutral" | "stone" | "slate"
export type RadiusSize = "none" | "sm" | "md" | "lg" | "full"
export type StylePreset = "vega" | "nova" | "maia" | "lyra" | "mira"

export interface ThemeConfig {
  mode: ThemeMode
  neutral: NeutralColor
  radius: RadiusSize
  style: StylePreset
}

const STORAGE_KEY = "coldvault-theme"

const DEFAULT_CONFIG: ThemeConfig = {
  mode: "system",
  neutral: "zinc",
  radius: "md",
  style: "vega",
}

const RADIUS_VALUES: Record<RadiusSize, string> = {
  none: "0rem",
  sm: "0.3rem",
  md: "0.5rem",
  lg: "0.75rem",
  full: "1.0rem",
}

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(config: ThemeConfig) {
  const effectiveMode = config.mode === "system" ? getSystemTheme() : config.mode

  // Apply dark mode class
  document.documentElement.classList.toggle("dark", effectiveMode === "dark")

  // Apply neutral color as data attribute
  document.documentElement.dataset.neutral = config.neutral

  // Apply style as data attribute
  document.documentElement.dataset.style = config.style

  // Apply radius as CSS variable
  document.documentElement.style.setProperty("--radius", RADIUS_VALUES[config.radius])
}

function loadConfig(): ThemeConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...DEFAULT_CONFIG, ...parsed }
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_CONFIG
}

function saveConfig(config: ThemeConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

export function useTheme() {
  const [config, setConfigState] = useState<ThemeConfig>(loadConfig)

  useEffect(() => {
    applyTheme(config)
    saveConfig(config)
  }, [config])

  // Listen for system theme changes when "system" is selected
  useEffect(() => {
    if (config.mode !== "system") return
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => applyTheme(config)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [config])

  const setMode = (mode: ThemeMode) => setConfigState(prev => ({ ...prev, mode }))
  const setNeutral = (neutral: NeutralColor) => setConfigState(prev => ({ ...prev, neutral }))
  const setRadius = (radius: RadiusSize) => setConfigState(prev => ({ ...prev, radius }))
  const setStyle = (style: StylePreset) => setConfigState(prev => ({ ...prev, style }))

  return {
    config,
    mode: config.mode,
    neutral: config.neutral,
    radius: config.radius,
    style: config.style,
    setMode,
    setNeutral,
    setRadius,
    setStyle,
  }
}

// For initial load (before React mounts)
export function initializeTheme() {
  const config = loadConfig()
  applyTheme(config)
}
