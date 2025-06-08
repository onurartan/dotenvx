"use client"

import type { SectionHeaderProps } from "@/types/docs"

export function SectionHeader({
  id,
  title,
  description,
  icon,
  setSectionRef,
}: SectionHeaderProps & {
  setSectionRef: (id: string) => (el: HTMLElement | null) => void
}) {
  return (
    <div ref={setSectionRef(id)} id={id} className="scroll-mt-20 space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      </div>
      {description && <p className="text-muted-foreground text-lg">{description}</p>}
    </div>
  )
}
