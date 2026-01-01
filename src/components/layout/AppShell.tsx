import React, { useState, useEffect } from 'react';
import { Resizable } from 're-resizable';

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const [isDesktop, setIsDesktop] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  if (!mounted) return null;

  if (!isDesktop) {
    return (
      <div className="min-h-screen h-screen flex flex-col bg-white dark:bg-[#0a0a0a] overflow-hidden">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center p-8 overflow-hidden">
      <Resizable
        defaultSize={{
          width: 440,
          height: 956,
        }}
        minWidth={320}
        maxWidth={800}
        minHeight={600}
        maxHeight={'95vh'}
        className="relative shadow-2xl transition-all ease-out"
        enable={{ right: true, left: true, bottom: false, top: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
        handleComponent={{
           right: <div className="absolute top-1/2 right-[-24px] w-1.5 h-16 bg-gray-600 rounded-full transform -translate-y-1/2 cursor-ew-resize hover:bg-white transition-colors opacity-50 hover:opacity-100" />,
           left: <div className="absolute top-1/2 left-[-24px] w-1.5 h-16 bg-gray-600 rounded-full transform -translate-y-1/2 cursor-ew-resize hover:bg-white transition-colors opacity-50 hover:opacity-100" />
        }}
        handleStyles={{
          right: { right: '-24px', width: '24px' },
          left: { left: '-24px', width: '24px' }
        }}
      >
        <div className="h-full w-full bg-white dark:bg-[#0a0a0a] rounded-[40px] overflow-hidden relative border-[8px] border-[#2c2c2e] shadow-inner flex flex-col">
            {children}
            {/* iOS Home Indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black/20 dark:bg-white/20 rounded-full z-50 pointer-events-none" />
        </div>
      </Resizable>
    </div>
  );
};