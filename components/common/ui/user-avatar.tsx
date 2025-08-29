"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name?: string;
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
  xl: 'h-12 w-12 text-lg'
};

/**
 * Component UserAvatar que genera iniciales automáticamente del nombre
 * Similar al comportamiento del navbar
 */
export function UserAvatar({ 
  name = '', 
  src, 
  alt, 
  size = 'md', 
  className = '' 
}: UserAvatarProps) {
  // Generar iniciales del nombre
  const getInitials = (fullName: string): string => {
    if (!fullName) return '?';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    // Tomar primera letra del primer nombre y primer apellido
    const firstInitial = names[0].charAt(0).toUpperCase();
    const lastInitial = names[names.length - 1].charAt(0).toUpperCase();
    
    return `${firstInitial}${lastInitial}`;
  };

  const initials = getInitials(name);

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {src && (
        <AvatarImage 
          src={src} 
          alt={alt || name}
        />
      )}
      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;