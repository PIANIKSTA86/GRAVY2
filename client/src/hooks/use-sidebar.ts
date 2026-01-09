import { useState, useEffect, useCallback } from "react";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof document === "undefined") return false;
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(SIDEBAR_COOKIE_NAME));
    return cookie ? cookie.split("=")[1] === "true" : false;
  });

  // Persist state to cookie
  useEffect(() => {
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${isCollapsed}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  }, [isCollapsed]);

  // Keyboard shortcut: Ctrl+B or Cmd+B
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        setIsCollapsed((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return {
    isCollapsed,
    toggleSidebar,
    state: isCollapsed ? "collapsed" : "expanded",
  };
}
