'use client';

import React from 'react';

interface DropdownMenuProps {
  children: React.ReactNode;
  [key: string]: any;
}

export function DropdownMenu({ children, ...props }: DropdownMenuProps) {
  return <div {...props}>{children}</div>;
}

export function DropdownMenuTrigger({ children, ...props }: DropdownMenuProps) {
  return <div {...props}>{children}</div>;
}

export function DropdownMenuContent({ children, ...props }: DropdownMenuProps) {
  return <div {...props}>{children}</div>;
}

export function DropdownMenuItem({ children, ...props }: DropdownMenuProps) {
  return <div {...props}>{children}</div>;
}

export function DropdownMenuSeparator({ ...props }: DropdownMenuProps) {
  return <hr {...props} />;
}

export function DropdownMenuSub({ children, ...props }: DropdownMenuProps) {
  return <div {...props}>{children}</div>;
}

export function DropdownMenuSubContent({ children, ...props }: DropdownMenuProps) {
  return <div {...props}>{children}</div>;
}

export function DropdownMenuSubTrigger({ children, ...props }: DropdownMenuProps) {
  return <div {...props}>{children}</div>;
}
