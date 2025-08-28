"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/common/ui/button';

interface TimeInputProps {
  value?: string; // "HH:MM" format
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  error?: boolean;
}

export function TimeInput({ 
  value = "", 
  onChange,
  disabled = false,
  className = "",
  placeholder = "Select time",
  error = false
}: TimeInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState("07");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  
  const hourInputRef = useRef<HTMLInputElement>(null);
  const minuteInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse the initial value
  useEffect(() => {
    if (value && value.includes(':')) {
      const [hours, minutes] = value.split(':');
      const hourNum = parseInt(hours);
      const minuteNum = parseInt(minutes);
      
      if (hourNum >= 1 && hourNum <= 12) {
        setHour(hourNum.toString().padStart(2, '0'));
        setPeriod(hourNum >= 12 ? "PM" : "AM");
      } else if (hourNum === 0) {
        setHour("12");
        setPeriod("AM");
      } else if (hourNum > 12) {
        setHour((hourNum - 12).toString().padStart(2, '0'));
        setPeriod("PM");
      }
      
      setMinute(minuteNum.toString().padStart(2, '0'));
    }
  }, [value]);

  // Calculate default time (current time + 1 hour)
  useEffect(() => {
    if (!value) {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      let hours = oneHourLater.getHours();
      const minutes = oneHourLater.getMinutes();
      
      // Ensure it's within delivery hours (12:00 PM - 9:00 PM)
      if (hours < 12) hours = 12;
      if (hours > 21) hours = 12; // Reset to tomorrow 12 PM
      
      const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
      const newPeriod: "AM" | "PM" = hours >= 12 ? "PM" : "AM";
      
      setHour(displayHour.toString().padStart(2, '0'));
      setMinute(minutes.toString().padStart(2, '0'));
      setPeriod(newPeriod);
      
      // Convert to 24-hour format and call onChange
      const time24 = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
      onChange?.(time24);
    }
  }, []);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDisplayTime = () => {
    if (!hour || !minute) return placeholder;
    return `${hour}:${minute} ${period}`;
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newHour = e.target.value.replace(/[^0-9]/g, '');
    if (newHour.length > 2) newHour = newHour.slice(0, 2);
    
    const hourNum = parseInt(newHour);
    if (hourNum > 12) newHour = '12';
    if (hourNum < 1 && newHour.length === 2) newHour = '01';
    
    setHour(newHour.padStart(2, '0'));
    updateTime(newHour.padStart(2, '0'), minute, period);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newMinute = e.target.value.replace(/[^0-9]/g, '');
    if (newMinute.length > 2) newMinute = newMinute.slice(0, 2);
    
    const minuteNum = parseInt(newMinute);
    if (minuteNum > 59) newMinute = '59';
    
    setMinute(newMinute.padStart(2, '0'));
    updateTime(hour, newMinute.padStart(2, '0'), period);
  };

  const updateTime = (h: string, m: string, p: "AM" | "PM") => {
    let hour24 = parseInt(h);
    
    if (p === "AM" && hour24 === 12) hour24 = 0;
    else if (p === "PM" && hour24 !== 12) hour24 += 12;
    
    const time24 = hour24.toString().padStart(2, '0') + ':' + m;
    onChange?.(time24);
  };

  const handleApply = () => {
    updateTime(hour, minute, period);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        type="button"
        variant="outline"
        className={`
          w-full justify-start text-left font-normal h-11
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {formatDisplayTime()}
        </span>
      </Button>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[280px]">
          <div className="text-sm font-medium text-gray-700 mb-3">Enter time</div>
          
          {/* Time inputs */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {/* Hour input */}
            <div className="flex flex-col items-center">
              <input
                ref={hourInputRef}
                type="text"
                value={hour}
                onChange={handleHourChange}
                className="w-16 h-16 text-2xl text-center border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none bg-indigo-50"
                maxLength={2}
                placeholder="07"
              />
              <div className="text-xs text-gray-500 mt-1">Hour</div>
            </div>

            {/* Separator */}
            <div className="text-2xl font-bold text-gray-400 pb-6">:</div>

            {/* Minute input */}
            <div className="flex flex-col items-center">
              <input
                ref={minuteInputRef}
                type="text"
                value={minute}
                onChange={handleMinuteChange}
                className="w-16 h-16 text-2xl text-center border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                maxLength={2}
                placeholder="00"
              />
              <div className="text-xs text-gray-500 mt-1">Minute</div>
            </div>

            {/* AM/PM toggle */}
            <div className="flex flex-col gap-1 ml-2 pb-6">
              <Button
                type="button"
                variant={period === "AM" ? "default" : "outline"}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => {
                  setPeriod("AM");
                  updateTime(hour, minute, "AM");
                }}
              >
                AM
              </Button>
              <Button
                type="button"
                variant={period === "PM" ? "default" : "outline"}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => {
                  setPeriod("PM");
                  updateTime(hour, minute, "PM");
                }}
              >
                PM
              </Button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="px-4"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleApply}
              className="px-4 bg-indigo-600 hover:bg-indigo-700"
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}