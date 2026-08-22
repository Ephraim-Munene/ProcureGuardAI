import React from 'react';

// Payment Processing / Loading Skeleton Overlay
export default function PaymentLoadingSkeleton({ isVisible, plan, phoneNumber }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-surface-container border border-outline-variant rounded-DEFAULT p-8 max-w-md w-full mx-4 flex flex-col items-center text-center">
        <div className="relative mb-6">
          <span className="material-symbols-outlined text-primary text-[48px] animate-pulse">
            payment
          </span>
          <div className="absolute -inset-4 border-2 border-primary rounded-full animate-ping opacity-20"></div>
        </div>

        <h3 className="font-display-lg text-display-lg text-primary mb-2">
          Processing Payment
        </h3>

        <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">
          Initiating M-Pesa STK Push for your <span className="text-primary font-data-mono">{plan}</span> plan subscription.
        </p>

        <div className="font-data-mono text-data-mono text-on-surface mb-4 bg-background px-4 py-2 border border-outline-variant rounded-DEFAULT">
          To: <span className="text-on-surface-variant">{phoneNumber || 'N/A'}</span>
        </div>

        <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-primary animate-pulse w-2/3 rounded-full transition-all duration-500"></div>
        </div>

        <p className="font-body-xs text-body-xs text-on-surface-variant">
          Check your phone for the STK Push prompt and enter your PIN to complete payment.
        </p>
      </div>
    </div>
  );
}
