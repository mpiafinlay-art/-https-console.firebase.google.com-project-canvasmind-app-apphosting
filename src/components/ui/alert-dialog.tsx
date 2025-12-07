'use client';

import React from 'react';

interface AlertDialogProps {
  children: React.ReactNode;
  [key: string]: any;
}

export function AlertDialog({ children, ...props }: AlertDialogProps) {
  return <div {...props}>{children}</div>;
}

export function AlertDialogTrigger({ children, ...props }: AlertDialogProps) {
  return <div {...props}>{children}</div>;
}

export function AlertDialogContent({ children, ...props }: AlertDialogProps) {
  return <div {...props}>{children}</div>;
}

export function AlertDialogHeader({ children, ...props }: AlertDialogProps) {
  return <div {...props}>{children}</div>;
}

export function AlertDialogTitle({ children, ...props }: AlertDialogProps) {
  return <h2 {...props}>{children}</h2>;
}

export function AlertDialogDescription({ children, ...props }: AlertDialogProps) {
  return <p {...props}>{children}</p>;
}

export function AlertDialogFooter({ children, ...props }: AlertDialogProps) {
  return <div {...props}>{children}</div>;
}

export function AlertDialogAction({ children, ...props }: AlertDialogProps) {
  return <button {...props}>{children}</button>;
}

export function AlertDialogCancel({ children, ...props }: AlertDialogProps) {
  return <button {...props}>{children}</button>;
}

