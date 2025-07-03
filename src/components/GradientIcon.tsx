import React from 'react';

interface GradientIconProps {
    children: React.ReactNode;
    gradient: 'blue' | 'purple' | 'green' | 'red' | 'yellow';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const GradientIcon: React.FC<GradientIconProps> = ({
    children,
    gradient,
    size = 'md',
    className = '',
}) => {
    const gradientClasses = {
        blue: 'bg-gradient-to-r from-blue-500 to-cyan-500',
        purple: 'bg-gradient-to-r from-purple-500 to-pink-500',
        green: 'bg-gradient-to-r from-green-500 to-teal-500',
        red: 'bg-gradient-to-r from-red-500 to-orange-500',
        yellow: 'bg-gradient-to-r from-yellow-500 to-amber-500',
    };

    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-16 h-16',
        lg: 'w-20 h-20',
    };

    const classes = `${gradientClasses[gradient]} ${sizeClasses[size]} rounded-2xl flex items-center justify-center ${className}`;

    return (
        <div className={classes}>
            <div className="text-white">
                {children}
            </div>
        </div>
    );
};

export default GradientIcon;
