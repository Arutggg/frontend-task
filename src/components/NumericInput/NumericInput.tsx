import {
  forwardRef,
  useLayoutEffect,
  useRef,
  type ChangeEvent,
  type InputHTMLAttributes,
} from 'react'
import { formatNumber, parseNumber } from '@/utils/formatNumber'

/** Минимальная ширина инпута в пикселях, согласно ТЗ. */
const MIN_WIDTH_PX = 72

/**
 * Пропсы NumericInput.
 * Наследуемся от стандартных пропсов <input>, переопределяем value и onChange
 * (работаем с числом, а не со строкой), убираем type (всегда text + inputMode="numeric").
 */
export interface NumericInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: number
  onChange: (value: number) => void
}

const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(function NumericInput(
  { value, onChange, className = '', style, ...rest },
  forwardedRef,
) {
  // Ссылка на сам <input>, чтобы управлять курсором и шириной программно.
  const inputRef = useRef<HTMLInputElement | null>(null)
  // Ссылка на скрытый <span>, по ширине которого подгоняем инпут.
  const measurerRef = useRef<HTMLSpanElement | null>(null)

  // Форматируем число для отображения: 1442 → "1 442"
  const displayValue = formatNumber(value)

  /**
   * Обработчик ввода:
   * 1) фильтруем нецифровое (parseNumber),
   * 2) сохраняем позицию курсора через подсчёт цифр слева от него.
   */
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    const rawValue = input.value
    const cursorPosition = input.selectionStart ?? rawValue.length
    const digitsLeftOfCursor = rawValue.slice(0, cursorPosition).replace(/\D/g, '').length

    const newNumericValue = parseNumber(rawValue)
    onChange(newNumericValue)

    // После рендера React-ом — ставим курсор в правильное место.
    requestAnimationFrame(() => {
      if (!inputRef.current) return
      const formatted = inputRef.current.value
      let digitsCount = 0
      let newCursorPosition = formatted.length
      for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) digitsCount++
        if (digitsCount === digitsLeftOfCursor) {
          newCursorPosition = i + 1
          break
        }
      }
      inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition)
    })
  }

  /**
   * Подгон ширины: меряем скрытый span с теми же символами и шрифтом,
   * берём max(минимум, измеренная ширина).
   */
  useLayoutEffect(() => {
    if (!inputRef.current || !measurerRef.current) return
    const measuredWidth = measurerRef.current.offsetWidth
    const finalWidth = Math.max(MIN_WIDTH_PX, measuredWidth)
    inputRef.current.style.width = `${finalWidth}px`
  }, [displayValue])

  /**
   * Объединяем внутренний и пробрасываемый ref.
   * Поддерживаем оба варианта forwardedRef: функция (callback ref) и объект.
   */
  const setRefs = (node: HTMLInputElement | null) => {
    inputRef.current = node
    if (typeof forwardedRef === 'function') {
      forwardedRef(node)
    } else if (forwardedRef) {
      forwardedRef.current = node
    }
  }

  return (
    <span className="relative inline-block">
      <input
        {...rest}
        ref={setRefs}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        style={style}
        className={
          'box-content border rounded px-1.5 py-0.5 text-sm outline-none ' +
          'transition-colors duration-300 ease-out ' +
          'border-gray-200 text-gray-300 ' +
          'hover:border-gray-400 ' +
          'focus:border-violet-600 focus:text-gray-900 ' +
          className
        }
      />
      {/* Скрытый span с теми же шрифтом и padding, что и у инпута — для измерения ширины. */}
      <span
        ref={measurerRef}
        aria-hidden="true"
        className="invisible absolute whitespace-pre px-1.5 py-0.5 text-sm"
      >
        {displayValue || '0'}
      </span>
    </span>
  )
})

export default NumericInput
