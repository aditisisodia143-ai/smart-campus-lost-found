import { useEffect, useRef, useState } from "react";

export default function Dropdown({ value, onChange, options, placeholder = "Select..." }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function selectOption(option) {
    onChange(option);
    setOpen(false);
  }

  return (
    <div className="dropdown" ref={wrapperRef}>
      <button
        type="button"
        className="dropdown-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? "" : "dropdown-placeholder"}>{value || placeholder}</span>
        <svg
          className={`dropdown-chevron${open ? " dropdown-chevron-open" : ""}`}
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul className="dropdown-panel" role="listbox">
          {options.map((option) => (
            <li
              key={option}
              role="option"
              aria-selected={option === value}
              className={`dropdown-option${option === value ? " dropdown-option-selected" : ""}`}
              onClick={() => selectOption(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
