import React, { useEffect, useRef } from 'react';
import { mountProfileSearch } from './mount.js';

export default function SearchApp() {
  const host = useRef(null);
  useEffect(() => mountProfileSearch(host.current), []);
  return <div ref={host} />;
}
