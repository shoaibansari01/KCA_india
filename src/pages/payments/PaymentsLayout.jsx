import React, { useState } from 'react';
import { CreditCard, Receipt, Award } from 'lucide-react';
import Payments from './Payments';
import PaymentReceipts from './PaymentReceipts';
import AllRounderPaymentReceipts from './AllRounderPaymentReceipts';

const PaymentsLayout = () => {
  const [activeTab, setActiveTab] = useState('payments');

  const tabs = [
    {
      id: 'payments',
      label: 'Payment Transactions',
      icon: CreditCard,
      component: Payments
    },
    {
      id: 'receipts',
      label: 'School Payment Receipts',
      icon: Receipt,
      component: PaymentReceipts
    },
    {
      id: 'allrounder-receipts',
      label: 'All-Rounder Receipts',
      icon: Award,
      component: AllRounderPaymentReceipts
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Payments;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        <ActiveComponent />
      </div>
    </div>
  );
};

export default PaymentsLayout;