import { useEffect } from "react";

export const useClickOutside = (ref, fun) => {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) {
        return;
      }
      fun();
    };
    document.addEventListener("mousedown", listener);
  }, []);
};
