import { useEffect, useRef, useState } from "react";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function pad(n) {
  return String(n).padStart(2, "0");
}

function toISODate(year, month, day) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function parseISODate(value) {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return { year: y, month: m - 1, day: d };
}

function formatDisplay(value) {
  const parsed = parseISODate(value);
  if (!parsed) return "";
  return `${pad(parsed.day)}-${pad(parsed.month + 1)}-${parsed.year}`;
}

export default function DatePicker({ value, onChange, placeholder = "dd-mm-yyyy" }) {
  const [open, setOpen] = useState(false);
  const selected = parseISODate(value);
  const today = new Date();
  const [viewYear, setViewYear] = useState(selected ? selected.year : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected ? selected.month : today.getMonth());
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

  function openCalendar() {
    if (selected) {
      setViewYear(selected.year);
      setViewMonth(selected.month);
    }
    setOpen((prev) => !prev);
  }

  function goToPrevMonth() {
    setViewMonth((prev) => {
      if (prev === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }

  function goToNextMonth() {
    setViewMonth((prev) => {
      if (prev === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  }

  function selectDay(day) {
    onChange(toISODate(viewYear, viewMonth, day));
    setOpen(false);
  }

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isSameDay = (day) =>
    selected && selected.year === viewYear && selected.month === viewMonth && selected.day === day;

  const isToday = (day) =>
    today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;

  return (
    <div className="datepicker" ref={wrapperRef}>
      <button
        type="button"
        className="datepicker-trigger"
        onClick={openCalendar}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={value ? "" : "datepicker-placeholder"}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="5" width="18" height="16" rx="3" />
          <path d="M3 9h18M8 3v4M16 3v4" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="datepicker-panel" role="dialog">
          <div className="datepicker-header">
            <button type="button" className="datepicker-nav" onClick={goToPrevMonth} aria-label="Previous month">
              ‹
            </button>
            <span className="datepicker-title">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button type="button" className="datepicker-nav" onClick={goToNextMonth} aria-label="Next month">
              ›
            </button>
          </div>

          <div className="datepicker-weekdays">
            {WEEKDAYS.map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </div>

          <div className="datepicker-grid">
            {cells.map((day, i) =>
              day === null ? (
                <span key={`empty-${i}`} className="datepicker-cell datepicker-cell-empty" />
              ) : (
                <button
                  type="button"
                  key={day}
                  className={`datepicker-cell${isSameDay(day) ? " datepicker-cell-selected" : ""}${
                    isToday(day) && !isSameDay(day) ? " datepicker-cell-today" : ""
                  }`}
                  onClick={() => selectDay(day)}
                >
                  {day}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
