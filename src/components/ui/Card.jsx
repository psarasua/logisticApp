import React from 'react';

const Card = ({ children, className = '', hover = false, clickable = false, ...props }) => {
  const baseClasses = 'bg-white rounded-lg border border-gray-200 transition-all duration-200';
  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1' : '';
  const clickableClasses = clickable ? 'cursor-pointer hover:shadow-md' : '';
  
  const classes = `${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`;
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`p-6 pb-4 ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`p-6 pt-4 border-t border-gray-100 ${className}`} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
