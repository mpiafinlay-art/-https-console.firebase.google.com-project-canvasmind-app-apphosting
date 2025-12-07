'use client';

import React from 'react';

interface PopoverProps {
  children: React.ReactNode;
  [key: string]: any;
}

export function Popover({ children, ...props }: PopoverProps) {
  return <div {...props}>{children}</div>;
}

export function PopoverTrigger({ children, ...props }: PopoverProps) {
  return <div {...props}>{children}</div>;
}

export function PopoverContent({ children, ...props }: PopoverProps) {
  return <div {...props}>{children}</div>;
}

