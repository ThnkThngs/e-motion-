'use client';

import React, { useRef, useEffect } from 'react';
import clsx from 'clsx';
import { createTemplateHoverAnimation } from '@/lib/animations';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'songket',
    name: 'Songket',
    description: 'Traditional woven patterns with gold threading',
    preview: '🧵',
  },
  {
    id: 'batik',
    name: 'Batik',
    description: 'Hand-drawn motif borders with earth tones',
    preview: '✨',
  },
  {
    id: 'floral',
    name: 'Floral',
    description: 'Red hibiscus with flowing botanical design',
    preview: '🌺',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean lines with geometric kerawang patterns',
    preview: '⬜',
  },
];

interface TemplateSelectorProps {
  selectedId?: string;
  onSelect: (templateId: string) => void;
}

export function TemplateSelector({
  selectedId,
  onSelect,
}: TemplateSelectorProps) {
  const buttonRefs = useRef<Record<string, HTMLButtonElement>>({});

  useEffect(() => {
    TEMPLATES.forEach((template) => {
      const button = buttonRefs.current[template.id];
      if (button) {
        createTemplateHoverAnimation(button);
      }
    });
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      {TEMPLATES.map((template) => (
        <button
          key={template.id}
          ref={(el) => {
            if (el) buttonRefs.current[template.id] = el;
          }}
          onClick={() => onSelect(template.id)}
          className={clsx(
            'text-left p-4 rounded-lg border-2 transition-none',
            selectedId === template.id
              ? 'border-indigo-700 bg-indigo-50'
              : 'border-neutral-200 bg-white'
          )}
        >
          <div className="text-3xl mb-2">{template.preview}</div>
          <h4 className="font-semibold text-neutral-900">{template.name}</h4>
          <p className="text-xs text-neutral-600 mt-1">
            {template.description}
          </p>
        </button>
      ))}
    </div>
  );
}
