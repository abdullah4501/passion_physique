import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const SavedCardsModal = ({ savedCards, onSelectCard, onAddNewCard }) => {
  const [isOpen, setIsOpen] = useState(true); // Open by default; toggle as needed

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#2E2E2E] p-6 rounded-lg w-[90%] max-w-md">
        <h2 className="text-white text-[24px] font-[600] mb-4">Select Payment Method</h2>
        {savedCards.length > 0 ? (
          <>
            {savedCards.map((card) => (
              <div
                key={card.id}
                className="bg-[#363636] p-3 mb-2 rounded-lg flex justify-between items-center"
              >
                <span className="text-white">
                  {card.brand.toUpperCase()} ending in {card.last4} (Exp: {card.exp_month}/{card.exp_year})
                </span>
                <Button
                  onClick={() => onSelectCard(card.id)}
                  className="bg-[#ff3131] hover:bg-[#e03228] text-white font-[600] text-[14px] px-4 py-2 rounded-none"
                >
                  Use
                </Button>
              </div>
            ))}
            <Button
              onClick={onAddNewCard}
              className="mt-4 w-full bg-primary hover:bg-primary/90 text-white font-[600] text-[14px] px-4 py-2 rounded-none"
            >
              Add New Card
            </Button>
          </>
        ) : (
          <p className="text-white">No saved cards found. Add a new card to proceed.</p>
        )}
        <Button
          onClick={() => setIsOpen(false)}
          className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white font-[600] text-[14px] px-4 py-2 rounded-none"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default SavedCardsModal;