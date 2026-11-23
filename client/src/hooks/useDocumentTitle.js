import { useEffect } from 'react';

/**
 * Custom hook to dynamically update document title across route transitions.
 * @param {string} title - The page title
 * @param {boolean} retainOnUnmount - Whether to retain title when unmounting
 */
export const useDocumentTitle = (title, retainOnUnmount = false) => {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) {
      document.title = `${title} — CampusCare`;
    }
    return () => {
      if (!retainOnUnmount) {
        document.title = prevTitle;
      }
    };
  }, [title, retainOnUnmount]);
};

export default useDocumentTitle;
