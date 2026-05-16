import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store'
import NumericInput from '@/components/NumericInput/NumericInput'

export default function Settings() {
  const minimumAgeInMonths = useStore((state) => state.minimumAgeInMonths)
  const setMinimumAgeInMonths = useStore((state) => state.setMinimumAgeInMonths)

  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="flex flex-col gap-6 p-8 max-w-md">
      <Link to="/" className="text-violet-600 hover:underline text-sm self-start">
        &larr; Back
      </Link>

      <h1 className="text-xl font-bold text-gray-700">Settings</h1>

      <div className="flex flex-col gap-2">
        <label
          className={
            'text-xs font-bold tracking-wider uppercase ' +
            'transition-colors duration-300 ease-out ' +
            (isFocused ? 'text-violet-600' : 'text-gray-700')
          }
        >
          Minimum age
        </label>
        <div className="flex items-baseline gap-2">
          <NumericInput
            value={minimumAgeInMonths}
            onChange={setMinimumAgeInMonths}
            placeholder="0"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <span className="text-sm text-gray-700">months</span>
        </div>
      </div>
    </div>
  )
}
