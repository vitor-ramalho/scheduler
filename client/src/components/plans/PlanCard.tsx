import React from 'react';
import { IPlan } from '@/services/plansService';

interface PlanCardProps {
  plan: IPlan;
  isSelected: boolean;
  onSelect: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isSelected, onSelect }) => {
  return (
    <div 
      className={`border rounded-lg p-6 transition-all cursor-pointer ${
        isSelected 
          ? 'border-teal-500 bg-teal-50 shadow-md' 
          : 'border-gray-200 hover:border-teal-300 hover:shadow'
      }`}
      onClick={onSelect}
    >
      <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
      <p className="text-gray-600 mb-4">{plan.description}</p>
      
      <div className="mb-4">
        <span className="text-2xl font-bold">${Number(plan.price).toFixed(2)}</span>
        {plan.interval && <span className="text-gray-500 ml-1">/{plan.interval}</span>}
      </div>
      
      <ul className="space-y-2">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="h-5 w-5 text-teal-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      
      <div className={`mt-6 text-center py-2 px-4 rounded-md ${
        isSelected 
          ? 'bg-teal-600 text-white' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {isSelected ? 'Selected' : 'Select Plan'}
      </div>
    </div>
  );
};

export default PlanCard;
