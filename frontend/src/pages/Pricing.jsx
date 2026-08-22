import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MpesaPaymentModal from '../components/MpesaPaymentModal';
import { TIERS } from '../data/tiers';

const ACTION_LABELS = {
  FREE: 'Use Free Tier',
  PRO: 'Activate License (10 KES)',
  ENTERPRISE: 'Activate License (20 KES)',
};

const ACTION_CLASSES = {
  FREE: 'border border-outline-variant text-on-surface font-data-mono hover:bg-surface-container-highest',
  PRO: 'bg-primary text-background font-data-mono hover:bg-primary-container',
  ENTERPRISE: 'border border-outline-variant text-on-surface font-data-mono hover:bg-surface-container-highest',
};

const Pricing = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tiers = TIERS.map((tier) => ({
    ...tier,
    action: ACTION_LABELS[tier.id],
    actionClass: ACTION_CLASSES[tier.id],
  }));

  const handlePlanSelect = (tier) => {
    if (tier.id === 'FREE') {
      // Free plan is auto-assigned on signup
      return;
    }
    setSelectedPlan(tier);
    setIsModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  return (
    <div className="bg-surface-container-lowest text-on-surface min-h-[calc(100vh-80px)] pb-12">
      <header className="mb-12 max-w-4xl px-gutter">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-2">License Configuration</h1>
        <p className="text-on-surface-variant font-body-sm text-body-sm">
          Select an oversight tier to provision Neural Scan capacity and forensic analysis capabilities.
          Billing is calculated per daily operational cycle.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl px-gutter">
        {tiers.map((tier) => {
          const isCurrent = user?.subscriptionPlan === tier.id;
          const isFree = tier.id === 'FREE';

          return (
            <div
              key={tier.id}
              className={`bg-surface-container border border-outline-variant p-6 flex flex-col justify-between h-full transition-colors rounded-DEFAULT relative ${
                isCurrent ? 'ring-1 ring-primary' : ''
              }`}
            >
              <div>
                {tier.badge && (
                  <div className="absolute top-0 right-0 bg-primary text-background font-data-label text-data-label px-2 py-1 rounded-bl-DEFAULT">
                    {tier.badge}
                  </div>
                )}
                <div className="font-data-label text-data-label text-muted-foreground uppercase tracking-wider mb-2">
                  TIER {tier.id === 'FREE' ? '01' : tier.id === 'PRO' ? '02' : '03'}
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-1">{tier.name}</h2>
                <div className="flex items-baseline space-x-1 mb-6">
                  <span className="font-data-mono text-display-lg text-on-surface">{tier.price}</span>
                  <span className="font-data-mono text-data-mono text-muted-foreground">{tier.priceLabel}</span>
                </div>
                <div className="space-y-4 mb-8">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">
                        check
                      </span>
                      <span className="text-on-surface-variant">{feature}</span>
                    </div>
                  ))}
                </div>
                {isCurrent && (
                  <div className="mb-4">
                    <span className="material-symbols-outlined text-[14px] text-primary">check_circle</span>
                    <span className="font-data-mono text-data-mono text-primary">Active Plan</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => handlePlanSelect(tier)}
                disabled={isCurrent}
                className={`w-full py-2.5 px-4 rounded-DEFAULT transition-colors flex items-center justify-center gap-2 cursor-pointer ${tier.actionClass} ${isCurrent ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isFree && !isCurrent && (
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    save
                  </span>
                )}
                {tier.action}
              </button>
            </div>
          );
        })}
      </div>

      {/* M-Pesa Payment Modal */}
      <MpesaPaymentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlan(null);
        }}
        plan={selectedPlan?.id}
        amount={selectedPlan?.amount}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Pricing;
