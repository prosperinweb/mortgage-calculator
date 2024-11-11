"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { SlidersHorizontal } from "lucide-react"

interface SliderToggleProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function SliderToggle({ checked, onCheckedChange }: SliderToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Switch
        id="slider-mode"
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <Label htmlFor="slider-mode" className="flex items-center gap-2 cursor-pointer">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Show sliders</span>
      </Label>
    </div>
  )
}