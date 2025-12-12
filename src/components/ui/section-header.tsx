interface SectionHeaderProps {
  title: string
  action?: React.ReactNode
  subtitle?: string
}

export function SectionHeader({ title, action, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-base font-bold text-neutral-900 leading-[1.4]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-neutral-500 mt-0.5 leading-[1.4]">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
