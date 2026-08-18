  export default function toDateInputValue(value?: string): string {
    if (!value) return "";
        return value.slice(0, 10); // "2026-03-03T00:00:00.000Z" → "2026-03-03"
  }