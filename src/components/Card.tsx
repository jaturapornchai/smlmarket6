import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hoverable?: boolean;
    padding?: 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    hoverable = false,
    padding = 'md',
}) => {
    const baseClasses = 'bg-white dark:bg-gray-800 rounded-2xl shadow-xl';
    const hoverClasses = hoverable ? 'hover:shadow-2xl transition-all duration-300 transform hover:scale-105' : '';

    const paddingClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    const classes = `${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`;

    return (
        <div className={classes}>
            {children}
        </div>
    );
};

export default Card;
