"use client";

import {useEffect, useState} from 'react';

/** Roteamento simples usado pela demonstração, baseado no hash da URL. */
export function useHashRoute() {
  const [route, setRoute] = useState('');

  useEffect(() => {
    const readRoute = () => {
      setRoute(location.hash.replace(/^#\/?/, ''));
      window.scrollTo(0, 0);
    };

    readRoute();
    window.addEventListener('hashchange', readRoute);
    return () => window.removeEventListener('hashchange', readRoute);
  }, []);

  return route;
}

export const go = (route: string) => {
  location.hash = '/' + route;
};
