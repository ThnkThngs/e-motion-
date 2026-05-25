'use client';

import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { RSVPFormData, RSVPFormErrors } from '@/types/card';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RSVPFormData) => void;
  cardToken?: string;
}

const INITIAL_FORM_DATA: RSVPFormData = {
  name: '',
  email: '',
  attending: 'yes',
  dietary: '',
  hasPlus1: false,
  plus1Name: '',
};

export function RSVPModal({
  isOpen,
  onClose,
  onSubmit,
}: RSVPModalProps) {
  const [formData, setFormData] = useState<RSVPFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<RSVPFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = useCallback(
    (field: keyof RSVPFormData, value: unknown): string | undefined => {
      switch (field) {
        case 'name':
          if (typeof value !== 'string') return undefined;
          if (value.trim().length < 3) {
            return 'Name must be at least 3 characters';
          }
          return undefined;

        case 'email':
          if (typeof value !== 'string') return undefined;
          if (!value.trim()) {
            return 'Email is required';
          }
          if (!validateEmail(value)) {
            return 'Please enter a valid email';
          }
          return undefined;

        case 'attending':
          if (!value) {
            return 'Please select your attendance';
          }
          return undefined;

        case 'plus1Name':
          if (formData.hasPlus1 && typeof value === 'string') {
            if (value.trim().length < 2) {
              return '+1 guest name must be at least 2 characters';
            }
          }
          return undefined;

        default:
          return undefined;
      }
    },
    [formData.hasPlus1]
  );

  const handleFieldBlur = (field: keyof RSVPFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleFieldChange = (
    field: keyof RSVPFormData,
    value: unknown
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: RSVPFormErrors = {};

    const nameError = validateField('name', formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateField('email', formData.email);
    if (emailError) newErrors.email = emailError;

    const attendingError = validateField('attending', formData.attending);
    if (attendingError) newErrors.attending = attendingError;

    if (formData.hasPlus1) {
      const plus1Error = validateField('plus1Name', formData.plus1Name);
      if (plus1Error) newErrors.plus1Name = plus1Error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      // TODO: API call in phase 3
      // await fetch(`/api/cards/${cardToken}/rsvp`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      onSubmit(formData);

      // Reset form and close
      setTimeout(() => {
        setFormData(INITIAL_FORM_DATA);
        setErrors({});
        setTouched({});
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setErrors({ name: 'Failed to submit RSVP. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="RSVP to Wedding" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          type="text"
          placeholder="Your full name"
          required
          value={formData.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          onBlur={() => handleFieldBlur('name')}
          error={touched.name ? errors.name : undefined}
        />

        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          required
          value={formData.email}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          onBlur={() => handleFieldBlur('email')}
          error={touched.email ? errors.email : undefined}
        />

        <div>
          <label
            htmlFor="attending"
            className="block text-sm font-medium text-neutral-900 mb-1.5"
          >
            Will you be attending?
          </label>
          <select
            id="attending"
            required
            value={formData.attending}
            onChange={(e) =>
              handleFieldChange(
                'attending',
                e.target.value as 'yes' | 'no' | 'maybe'
              )
            }
            onBlur={() => handleFieldBlur('attending')}
            className={clsx(
              'w-full px-3 py-2 border border-neutral-200 rounded-lg',
              'text-neutral-900 placeholder-neutral-500',
              'transition-colors duration-100',
              'focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              errors.attending &&
                touched.attending &&
                'border-rose-500 focus:ring-rose-500'
            )}
          >
            <option value="yes">Yes, I will attend</option>
            <option value="maybe">Maybe, still deciding</option>
            <option value="no">No, I cannot attend</option>
          </select>
          {errors.attending && touched.attending && (
            <p className="mt-1 text-sm text-rose-500">{errors.attending}</p>
          )}
        </div>

        <Input
          label="Dietary Requirements (optional)"
          type="text"
          placeholder="e.g. Vegetarian, Halal, Kosher"
          value={formData.dietary}
          onChange={(e) => handleFieldChange('dietary', e.target.value)}
        />

        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasPlus1}
              onChange={(e) => handleFieldChange('hasPlus1', e.target.checked)}
              className="w-4 h-4 rounded border-neutral-300 text-indigo-700 focus:ring-indigo-700"
            />
            <span className="text-sm font-medium text-neutral-900">
              I will bring a +1 guest
            </span>
          </label>

          {formData.hasPlus1 && (
            <Input
              label="+1 Guest Name"
              type="text"
              placeholder="Guest name"
              value={formData.plus1Name}
              onChange={(e) => handleFieldChange('plus1Name', e.target.value)}
              onBlur={() => handleFieldBlur('plus1Name')}
              error={touched.plus1Name ? errors.plus1Name : undefined}
            />
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
        </Button>
      </form>
    </Modal>
  );
}
