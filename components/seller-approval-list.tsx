"use client";

import { useState } from "react";
import { approveSeller, rejectSeller } from "@/app/(seller)/actions";

type Seller = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  business_name: string;
  verification_status: "pending" | "approved" | "rejected";
  verification_notes: string | null;
  created_at: string;
  photo_url: string | null;
};

export default function SellerApprovalList({
  pendingSellers,
  allSellers,
}: {
  pendingSellers: Seller[];
  allSellers: Seller[];
}) {
  const [processing, setProcessing] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleApprove = async (sellerId: string) => {
    setProcessing(sellerId);
    const result = await approveSeller(sellerId, notes[sellerId] || "");
    setProcessing(null);
    if (!result?.error) {
      window.location.reload();
    } else {
      alert(result.error);
    }
  };

  const handleReject = async (sellerId: string) => {
    if (!confirm("Are you sure you want to reject this seller?")) {
      return;
    }
    setProcessing(sellerId);
    const result = await rejectSeller(sellerId, notes[sellerId] || "");
    setProcessing(null);
    if (!result?.error) {
      window.location.reload();
    } else {
      alert(result.error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Pending Sellers Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          Pending Approvals ({pendingSellers.length})
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Review and approve seller registration requests
        </p>

        {pendingSellers.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <p className="text-lg font-semibold text-slate-700">No pending approvals</p>
            <p className="mt-2 text-sm text-slate-500">All sellers have been reviewed</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {pendingSellers.map((seller) => (
              <div
                key={seller.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {seller.photo_url ? (
                      <img
                        src={seller.photo_url}
                        alt={seller.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-xl font-semibold text-white">
                        {seller.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{seller.name}</h3>
                      <p className="text-sm text-slate-600">{seller.business_name}</p>
                      <p className="text-sm text-slate-500">{seller.email}</p>
                      <p className="text-sm text-slate-500">{seller.mobile}</p>
                      <p className="mt-2 text-xs text-slate-400">
                        Registered: {new Date(seller.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Verification Notes (Optional)
                    </label>
                    <textarea
                      value={notes[seller.id] || ""}
                      onChange={(e) =>
                        setNotes((prev) => ({ ...prev, [seller.id]: e.target.value }))
                      }
                      placeholder="Add any notes about this seller..."
                      rows={2}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(seller.id)}
                      disabled={processing === seller.id}
                      className="rounded-full bg-green-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {processing === seller.id ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleReject(seller.id)}
                      disabled={processing === seller.id}
                      className="rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {processing === seller.id ? "Processing..." : "Reject"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Sellers Overview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          All Sellers ({allSellers.length})
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allSellers.map((seller) => (
            <div
              key={seller.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center gap-3">
                {seller.photo_url ? (
                  <img
                    src={seller.photo_url}
                    alt={seller.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                    {seller.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{seller.name}</h3>
                  <p className="text-xs text-slate-600">{seller.business_name}</p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                    seller.verification_status
                  )}`}
                >
                  {seller.verification_status}
                </span>
              </div>
              {seller.verification_notes && (
                <p className="mt-2 text-xs text-slate-500">{seller.verification_notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

