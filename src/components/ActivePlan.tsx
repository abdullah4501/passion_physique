import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ActivePlan = () => {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchActivePlan = async () => {
            setLoading(true);
            setError("");
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/active`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "No active plan found.");
                setPlan(data.plan);
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        };
        fetchActivePlan();
    }, []);

    if (loading) {
        return <div className="text-[#ccc] text-lg pt-8">Loading active plan...</div>;
    }
    if (error) {
        return <div className="text-red-500 text-lg pt-8">{error}</div>;
    }
    if (!plan) {
        return <div className="text-[#ccc] text-lg pt-8">You have no active plan.</div>;
    }

    // Format the dates
    const startDate = new Date(plan.startDate).toLocaleDateString();
    const endDate = new Date(plan.endDate).toLocaleDateString();

    return (
        <div className="bg-[#2E2E2E] px-7 py-9 rounded-[2px]">
            <h2 className="text-white text-[24px] font-[600] mb-7 border-b border-[#acacac] pb-1">
                Active Plan Details
            </h2>
            <div className="flex flex-col gap-4 text-[17px]">
                <div className="flex justify-between">
                    <span className="text-[#ccc]">Plan Name:</span>
                    <span className="text-white">{plan.name}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-[#ccc]">Amount:</span>
                    <span className="text-white">€{plan.amount}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-[#ccc]">Renewal Date:</span>
                    <span className="text-white">{endDate}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-[#ccc]">Period:</span>
                    <span className="text-white">{plan.period}</span>
                </div>
                {plan.note && (
                    <div className="flex justify-between">
                        <span className="text-[#ccc]">Note:</span>
                        <span className="text-white">{plan.note}</span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span className="text-[#ccc]">Status:</span>
                    <span className="text-green-500 font-bold capitalize">{plan.paymentStatus}</span>
                </div>
            </div>
            <button
                className="mt-10 w-full h-[45px] bg-[#ff3c33] hover:bg-[#e03228] text-white font-[600] text-[16px] transition-all duration-150 rounded-none"
                onClick={() => navigate("/coaching-plans")}
            >
                Upgrade Plan
            </button>
        </div>
    );
};

export default ActivePlan;
