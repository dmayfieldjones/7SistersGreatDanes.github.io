import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { ALL_OTHER_BREEDS, breedLabel } from '../../lib/pointSchedule2026'

interface BreedPickerProps {
  breeds: string[]
  value: string
  onChange: (breed: string) => void
}

const MAX_VISIBLE_OPTIONS = 300

export default function BreedPicker({
  breeds,
  value,
  onChange,
}: BreedPickerProps) {
  const [inputValue, setInputValue] = useState(breedLabel(value))
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()
  const optionIdPrefix = useId()

  useEffect(() => {
    setInputValue(breedLabel(value))
  }, [value])

  const filtered = useMemo(() => {
    const query = inputValue.trim().toLowerCase()
    const matches =
      query.length === 0
        ? breeds
        : breeds.filter(breed => breed.toLowerCase().includes(query))
    return matches.slice(0, MAX_VISIBLE_OPTIONS)
  }, [breeds, inputValue])

  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setInputValue(breedLabel(value))
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [isOpen, value])

  useEffect(() => {
    if (!isOpen || activeIndex < 0) return
    document
      .getElementById(`${optionIdPrefix}-${activeIndex}`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, isOpen, optionIdPrefix])

  const commitSelection = (breed: string) => {
    onChange(breed)
    setInputValue(breedLabel(breed))
    setIsOpen(false)
    setActiveIndex(-1)
  }

  const openWithCurrentInput = () => {
    setIsOpen(true)
    setActiveIndex(-1)
  }

  return (
    <div className="ps-breed-picker" ref={rootRef}>
      <label className="ps-breed-label" htmlFor={`${optionIdPrefix}-input`}>
        Breed (type to search)
      </label>
      <div className="ps-breed-combobox">
        <input
          id={`${optionIdPrefix}-input`}
          ref={inputRef}
          type="text"
          className="ps-breed-input"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            isOpen && activeIndex >= 0
              ? `${optionIdPrefix}-${activeIndex}`
              : undefined
          }
          autoComplete="off"
          value={inputValue}
          placeholder="Search breeds…"
          onFocus={() => {
            inputRef.current?.select()
            openWithCurrentInput()
          }}
          onChange={e => {
            setInputValue(e.target.value)
            openWithCurrentInput()
          }}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              if (!isOpen) {
                openWithCurrentInput()
                return
              }
              setActiveIndex(i => (i + 1 >= filtered.length ? 0 : i + 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              if (!isOpen) {
                openWithCurrentInput()
                return
              }
              setActiveIndex(i => (i - 1 < 0 ? filtered.length - 1 : i - 1))
            } else if (e.key === 'Enter') {
              if (isOpen && activeIndex >= 0 && filtered[activeIndex]) {
                e.preventDefault()
                commitSelection(filtered[activeIndex])
              }
            } else if (e.key === 'Escape') {
              if (isOpen) {
                e.preventDefault()
                setIsOpen(false)
                setActiveIndex(-1)
                setInputValue(breedLabel(value))
              }
            }
          }}
          onBlur={() => {
            // Let click-on-option (mousedown) commit first; otherwise revert.
            window.setTimeout(() => {
              if (!isOpen) return
              setIsOpen(false)
              setActiveIndex(-1)
              setInputValue(breedLabel(value))
            }, 0)
          }}
        />
        {isOpen && (
          <ul
            id={listboxId}
            role="listbox"
            className="ps-breed-listbox"
            aria-label="Breeds"
          >
            {filtered.length === 0 && (
              <li className="ps-breed-empty">No breeds match “{inputValue}”</li>
            )}
            {filtered.map((breed, i) => (
              <li
                key={breed}
                id={`${optionIdPrefix}-${i}`}
                role="option"
                aria-selected={breed === value}
                className={
                  'ps-breed-option' +
                  (i === activeIndex ? ' ps-breed-option-active' : '') +
                  (breed === value ? ' ps-breed-option-selected' : '') +
                  (breed === ALL_OTHER_BREEDS ? ' ps-breed-option-catchall' : '')
                }
                onMouseDown={e => {
                  // preventDefault keeps the input from blurring before we commit.
                  e.preventDefault()
                  commitSelection(breed)
                }}
                onMouseEnter={() => setActiveIndex(i)}
              >
                {breedLabel(breed)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
