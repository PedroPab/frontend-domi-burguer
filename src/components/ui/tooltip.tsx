import React, { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          backgroundColor: '#333',
          color: '#fff',
          padding: '5px 10px',
          borderRadius: '4px',
          whiteSpace: 'nowrap',
          zIndex: 1000,
        }}>
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
