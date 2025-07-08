"use client";

import type { LucideProps } from 'lucide-react';
import {
  BrainCircuit,
  TerminalSquare,
  Server,
  Zap,
  BookOpen,
  Palette,
  Component, // Default/fallback icon
  ExternalLink,
  Github,
} from 'lucide-react';

export const iconMap = {
  BrainCircuit,
  TerminalSquare,
  Server,
  Zap,
  BookOpen,
  Palette,
  ExternalLink,
  Github,
  Default: Component,
};

export type IconName = keyof typeof iconMap;

interface DynamicIconProps extends LucideProps {
  name?: IconName | string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  const IconComponent = name && name in iconMap ? iconMap[name as IconName] : iconMap.Default;
  return <IconComponent {...props} />;
};
