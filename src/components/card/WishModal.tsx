'use client';

import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { WishFormData, WishFormErrors } from '@/types/card';

interface WishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WishFormData) => void;
  cardToken?: string;
}

const INITIAL_FORM_DATA: WishFormData = {
  name: '',
  email: '',
  message: '',
};

const MESSAGE_MAX_LENGTH = 500;
const MESSAGE_MIN_LENGTH = 10;

export function WishModal({
  isOpen,
  onClose,
  onSubmit,
}: WishModalProps) {
  const [formData, setFormData] = useState<WishFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<WishFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = useCallback(
    (field: keyof WishFormData, value: unknown): string | undefined => {
      switch (field) {
        case 'name':
          if (typeof value !== 'string') return undefined;
          if (value.trim().length < 2) {
            return 'Name must be at least 2 characters';
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

        case 'message':
          if (typeof value !== 'string') return undefined;
          if (value.trim().length < MESSAGE_MIN_LENGTH) {
            return `Message must be at least ${MESSAGE_MIN_LENGTH} characters`;
          }
          if (value.length > MESSAGE_MAX_LENGTH) {
            return `Message cannot exceed ${MESSAGE_MAX_LENGTH} characters`;
          }
          return undefined;

        default:
          return undefined;
      }
    },
    []
  );

  const handleFieldBlur = (field: keyof WishFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleFieldChange = (
    field: keyof WishFormData,
    value: string
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
    const newErrors: WishFormErrors = {};

    const nameError = validateField('name', formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateField('email', formData.email);
    if (emailError) newErrors.email = emailError;

    const messageError = validateField('message', formData.message);
    if (messageError) newErrors.message = messageError;

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
      // await fetch(`/api/cards/${cardToken}/wishes`, {
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
      console.error('Error submitting wish:', error);
      setErrors({ name: 'Failed to submit wish. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Write Your Wishes"
      size="md"
    >
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
            htmlFor="message"
            className="block text-sm font-medium text-neutral-900 mb-1.5"
          >
            Your Message
          </label>
          <textarea
            id="message"
            placeholder="Write your wishes and blessings for the couple..."
            required
            minLength={MESSAGE_MIN_LENGTH}
            maxLength={MESSAGE_MAX_LENGTH}
            value={formData.message}
            onChange={(e) => handleFieldChange('message', e.target.value)}
            onBlur={() => handleFieldBlur('message')}
            className={clsx(
              'w-full px-3 py-2 border border-neutral-200 rounded-lg',
              'text-neutral-900 placeholder-neutral-500',
              'transition-colors duration-100',
              'focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'resize-none h-32',
              errors.message &&
                touched.message &&
                'border-rose-500 focus:ring-rose-500'
            )}
          />
          <div className="flex items-center justify-between mt-2">
            {errors.message && touched.message && (
              <p className="text-sm text-rose-500">{errors.message}</p>
            )}
            <p
              className={clsx(
                'text-sm ml-auto',
                formData.message.length > MESSAGE_MAX_LENGTH * 0.9
                  ? 'text-rose-500'
                  : 'text-neutral-600'
              )}
            >
              {formData.message.length}/{MESSAGE_MAX_LENGTH}
            </p>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Wish'}
        </Button>
      </form>
    </Modal>
  );
}
