import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function AdminHeaderAction({ children }: { children: React.ReactNode }) {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setTarget(document.getElementById('admin-page-header-actions'));
  }, []);

  return target ? createPortal(children, target) : null;
}
