import { controlClasses } from '@/components/ui/control-classes'
import type { InvestmentFilters } from '@/types/models'

export interface PriceRangeFilterProps {
  minPrice: string
  maxPrice: string
  onChange: (patch: Partial<InvestmentFilters>) => void
}

const PRICE_INPUT_CLASSES = controlClasses({ className: 'px-3' })

/** Min/max asking-price inputs. Empty string means "no bound". */
export function PriceRangeFilter({ minPrice, maxPrice, onChange }: PriceRangeFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={0}
        step="1000"
        inputMode="numeric"
        value={minPrice}
        onChange={(event) => onChange({ minPrice: event.target.value })}
        placeholder="Min asking €"
        aria-label="Minimum asking price"
        className={PRICE_INPUT_CLASSES}
      />
      <span className="text-sm text-slate-400 dark:text-slate-500">–</span>
      <input
        type="number"
        min={0}
        step="1000"
        inputMode="numeric"
        value={maxPrice}
        onChange={(event) => onChange({ maxPrice: event.target.value })}
        placeholder="Max asking €"
        aria-label="Maximum asking price"
        className={PRICE_INPUT_CLASSES}
      />
    </div>
  )
}
