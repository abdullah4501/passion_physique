import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import ConfirmModal from "./ConfirmModal";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY); // Set in your .env

const PaymentForm = ({ onCardAdded }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setProcessing(true);

        if (!stripe || !elements) {
            setError('Stripe not loaded');
            setProcessing(false);
            return;
        }

        // Create PaymentMethod with card details
        const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardNumberElement),
        });
        if (methodError) {
            setError(methodError.message);
            setProcessing(false);
            return;
        }

        // Send PaymentMethod to backend to attach to customer
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/add-card`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
        });
        const data = await res.json();
        if (!res.ok) {
            setError(data.error || 'Failed to add card');
        } else {
            onCardAdded();
        }
        setProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
            <div>
                <label className="block text-white text-[16px] mb-2">Card Number*</label>
                <div className="bg-[#333] px-4 h-[38px] flex items-center mb-4">
                    <CardNumberElement className="flex-1" options={{ style: { base: { color: '#fff', fontSize: '16px' } } }} />
                </div>
            </div>
            <div >
                <label className="block text-white text-[16px] mb-2">Expiration Date*</label>
                <div className="bg-[#333] px-4 h-[38px] flex items-center mb-4">
                    <CardExpiryElement className="flex-1" options={{ style: { base: { color: '#fff', fontSize: '16px' } } }} />
                </div>
            </div>
            <div >
                <label className="block text-white text-[16px] mb-2">CVV*</label>
                <div className="bg-[#333] px-4 h-[38px] flex items-center mb-4">
                    <CardCvcElement className="flex-1" options={{ style: { base: { color: '#fff', fontSize: '16px' } } }} />
                </div>
            </div>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <button
                type="submit"
                className="w-[120px] h-[45px] bg-[#ff3c33] hover:bg-[#e03228] text-white font-[600] text-[16px] rounded-none"
                disabled={processing}
            >
                {processing ? 'Saving...' : 'Save'}
            </button>
        </form>
    );
};

const PaymentInfo = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [defaultCardId, setDefaultCardId] = useState('');
    const [addingCard, setAddingCard] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const fetchCards = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/saved-cards`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        setCards(data.cards || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchCards();
    }, []);

    // Fetch default card
    useEffect(() => {
        const fetchDefault = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/default-card`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setDefaultCardId(data.defaultCardId || '');
            }
        };
        fetchDefault();
    }, []);

    const handleDelete = async (id) => {
        setConfirmDeleteId(id); // Open modal
    };

    const handleConfirmDelete = async () => {
        if (!confirmDeleteId) return;
        const token = localStorage.getItem('token');
        await fetch(`${import.meta.env.VITE_API_URL}/api/payments/delete-card/${confirmDeleteId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        setConfirmDeleteId(null); // Close modal
        fetchCards();
    };

    const handleCancelDelete = () => {
        setConfirmDeleteId(null);
    };

    const handleSetDefault = async (id) => {
        const token = localStorage.getItem('token');
        await fetch(`${import.meta.env.VITE_API_URL}/api/payments/set-default-card`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentMethodId: id }),
        });
        setDefaultCardId(id);
    };

    const ToggleSwitch = ({ checked, onChange }) => (
        <button
            type="button"
            aria-pressed={checked}
            onClick={onChange}
            className={`relative w-[42px] h-[20px] rounded-full transition-colors duration-150 ${checked ? 'bg-[#D9D9D9]' : 'bg-[#D9D9D9]'
                }`}
            style={{ outline: 'none', border: 'none', padding: 0 }}
        >
            <span
                className={`absolute left-1 top-[3px] w-[14px] h-[14px] rounded-full transition-transform duration-150 bg-[#FF3131] ${checked ? 'translate-x-5' : ''
                    }`}
                style={{
                    boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
                    transform: checked ? 'translateX(20px)' : 'none',
                }}
            />
        </button>
    );

    return (
        <div>
            <div className="border-b border-[#acacac] mb-7 pb-1">
                <h2 className="text-white text-[24px] font-[600]">Payment Info</h2>
            </div>
            {/* Card List */}
            {loading ? (
                <div className="text-[#ccc]">Loading...</div>
            ) : (
                <>
                    {cards.map((card) => (
                        <div key={card.id} className="bg-[#333] px-6 py-8 mb-6 flex items-start justify-between">
                            <div>
                                <div className="text-white text-lg mb-6">
                                    Card Number: xxxx xxxx xxxx {card.last4}
                                </div>
                                <div className="text-white mb-6">
                                    Expiration Date: {String(card.exp_month).padStart(2, '0')}/{String(card.exp_year).slice(-2)}
                                </div>
                                <div className="text-white">CVV: ***</div>
                            </div>
                            {/* Right Side: Switch on top, delete at bottom */}
                            <div className="flex flex-col justify-between h-full" style={{ minHeight: 125 }}>
                                <div className="flex items-center gap-2 mb-2 self-end w-full justify-between">
                                    <span className="text-white text-lg">Default</span>
                                    <ToggleSwitch
                                        checked={defaultCardId === card.id}
                                        onChange={() => handleSetDefault(card.id)}
                                    />
                                </div>
                                <button
                                    className="w-[120px] h-[45px] mt-2 bg-[#ff3c33] hover:bg-[#e03228] text-white font-[600] text-[16px] transition-all duration-150 rounded-none self-end"
                                    onClick={() => handleDelete(card.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                    ))}
                </>
            )}

            {/* Add New Card */}
            <h2 className="text-white text-[32px] mt-12 mb-4">Add New Card</h2>
            <Elements stripe={stripePromise}>
                <PaymentForm onCardAdded={fetchCards} />
            </Elements>
            <ConfirmModal
                open={!!confirmDeleteId}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Delete Card"
                description="Are you sure you want to delete this card? This action cannot be undone."
            />
        </div>
    );
};

export default PaymentInfo;
