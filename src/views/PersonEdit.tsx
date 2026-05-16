import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '@/store'
import NumericInput from '@/components/NumericInput/NumericInput'

export default function PersonEdit() {
  const { id } = useParams<{ id: string }>()
  const person = useStore((state) => state.people.find((p) => p.id === Number(id)))
  const updatePersonAge = useStore((state) => state.updatePersonAge)

  // Состояние фокуса — синхронно подсвечиваем лейбл и рамку фото.
  const [isFocused, setIsFocused] = useState(false)

  if (!person) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Person not found</p>
        <Link to="/" className="text-violet-600 hover:underline text-sm">
          Back to list
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-8 max-w-md">
      <Link to="/" className="text-violet-600 hover:underline text-sm self-start">
        &larr; Back
      </Link>

      {/* photo + input компонент. Gap 16px (как в Figma), центрируем по вертикали. */}
      <div className="flex items-center gap-4">
        <img
          src="/img.png"
          alt={person.name}
          className={
            'w-14 h-14 rounded-full border-2 object-cover shrink-0 ' +
            'transition-colors duration-300 ease-out ' +
            (isFocused ? 'border-violet-600' : 'border-transparent')
          }
        />

        {/* input-блок: лейбл сверху, инпут+подпись снизу. Gap 8px. */}
        <div className="flex flex-col gap-2">
          <label
            className={
              'text-xs font-bold tracking-wider uppercase ' +
              'transition-colors duration-300 ease-out ' +
              (isFocused ? 'text-violet-600' : 'text-gray-700')
            }
          >
            {person.name} is
          </label>
          <div className="flex items-baseline gap-2">
            <NumericInput
              value={person.ageInHours}
              onChange={(newAge) => updatePersonAge(person.id, newAge)}
              placeholder="0"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <span className="text-sm text-gray-700">hours old</span>
          </div>
        </div>
      </div>
    </div>
  )
}
