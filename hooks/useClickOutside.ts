import { useEffect, useRef } from "react";

export function useClickOutside<T extends HTMLElement>(
  handler: () => void,
  isOpen: boolean,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    // اگر منو بسته است، نیازی به لیسنر نیست
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      // اگر روی خود المان یا فرزندانش کلیک نشده باشد
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    // اضافه کردن لیسنر با کمی تأخیر (برای جلوگیری از تداخل با دکمه باز کننده)
    // requestAnimationFrame یا setTimeout(0) کمک می‌کنه ایونتِ باز شدنِ منو، بلافاصله باعث بسته شدنش نشه
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handler]);

  return ref;
}
