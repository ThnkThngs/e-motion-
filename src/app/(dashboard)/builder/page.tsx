'use client';

import React, { useState } from 'react';
import { CardPreview } from '@/components/builder/CardPreview';
import { TemplateSelector } from '@/components/builder/TemplateSelector';
import { FormSection } from '@/components/builder/FormSection';
import { Input, Button, Select } from '@/components/ui';

const ACCENT_COLORS = [
  { value: 'indigo', label: 'Indigo (Primary)' },
  { value: 'amber', label: 'Amber (Gold)' },
  { value: 'rose', label: 'Rose (Bunga Raya)' },
  { value: 'teal', label: 'Teal (Kerawang)' },
];

export default function BuilderPage() {
  const [templateId, setTemplateId] = useState('songket');
  const [coupleName, setCoupleName] = useState('Your Names');
  const [eventDate, setEventDate] = useState('Your Event Date');
  const [accentColor, setAccentColor] = useState('indigo');

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-neutral-900">
            Create Your Invitation
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Customize your wedding invitation with heritage aesthetics
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8 items-start">
          {/* Left: Form */}
          <div className="col-span-1 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
            <FormSection
              title="Template"
              description="Choose your wedding invitation style"
            >
              <TemplateSelector
                selectedId={templateId}
                onSelect={setTemplateId}
              />
            </FormSection>

            <FormSection
              title="Couple Details"
              description="Tell us about you"
            >
              <Input
                label="Couple Names"
                value={coupleName}
                onChange={(e) => setCoupleName(e.target.value)}
                placeholder="e.g., Amir & Siti"
              />
              <Input
                label="Event Date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </FormSection>

            <FormSection
              title="Customization"
              description="Personalize your card"
            >
              <Select
                label="Accent Color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                options={ACCENT_COLORS}
              />
            </FormSection>

            <div className="flex gap-3">
              <Button variant="secondary" size="md" className="flex-1">
                Save Draft
              </Button>
              <Button variant="primary" size="md" className="flex-1">
                Publish
              </Button>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="col-span-2">
            <div className="sticky top-20 bg-white rounded-lg p-8 shadow-md">
              <h3 className="text-sm font-semibold text-neutral-900 mb-4 uppercase tracking-wider">
                Live Preview
              </h3>
              <CardPreview
                templateId={templateId}
                coupleName={coupleName}
                eventDate={eventDate}
                accentColor={accentColor}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
