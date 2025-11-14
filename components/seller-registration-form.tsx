"use client";

import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerSeller } from "@/app/(seller)/actions";

const initialState: { error?: string } | undefined = undefined;

function SubmitButton({ step, totalSteps }: { step: number; totalSteps: number }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
    >
      {pending
        ? "Submitting..."
        : step === totalSteps
          ? "Submit Registration"
          : "Next Step"}
    </button>
  );
}

export default function SellerRegistrationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    name: "",
    email: "",
    mobile: "",
    photo: null as File | null,
    // Step 2: Addresses
    home_address: "",
    pickup_address: "",
    // Step 3: Business Details
    gstin: "",
    pan_card: "",
    business_name: "",
    // Step 4: Banking
    bank_account_number: "",
    ifsc_code: "",
    bank_statement: null as File | null,
    // Step 5: Address Proof
    address_proof: null as File | null,
    // Step 6: Additional Documents
    trademark_certificate: null as File | null,
    authorization_letter: null as File | null,
  });

  const [errorMessage, formAction] = useActionState(registerSeller, initialState);

  const totalSteps = 6;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFormAction = async (formDataToSubmit: FormData) => {
    // Append all form fields from state to the FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        formDataToSubmit.append(key, value);
      } else if (value !== null && value !== undefined && value !== "") {
        formDataToSubmit.append(key, value as string);
      }
    });
    
    return formAction(formDataToSubmit);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                s <= step
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-slate-300 bg-white text-slate-400"
              }`}
            >
              {s}
            </div>
            {s < totalSteps && (
              <div
                className={`h-1 w-16 ${
                  s < step ? "bg-indigo-600" : "bg-slate-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form 
        action={step === totalSteps ? handleFormAction : undefined}
        onSubmit={step < totalSteps ? handleNext : (e) => {
          // On final step, let the form action handle submission
          // All data will be merged in handleFormAction
        }} 
        className="space-y-6"
      >
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-slate-700">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  required
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="photo" className="block text-sm font-medium text-slate-700">
                  Photo *
                </label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  required
                  onChange={handleFileChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Addresses */}
        {step === 2 && (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Addresses</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="home_address" className="block text-sm font-medium text-slate-700">
                  Home Address *
                </label>
                <textarea
                  id="home_address"
                  name="home_address"
                  required
                  rows={3}
                  value={formData.home_address}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="pickup_address" className="block text-sm font-medium text-slate-700">
                  Product Pickup Address *
                </label>
                <textarea
                  id="pickup_address"
                  name="pickup_address"
                  required
                  rows={3}
                  value={formData.pickup_address}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Business Details */}
        {step === 3 && (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Business Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="gstin" className="block text-sm font-medium text-slate-700">
                  GSTIN (Goods and Services Tax Identification Number)
                </label>
                <input
                  type="text"
                  id="gstin"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="pan_card" className="block text-sm font-medium text-slate-700">
                  PAN Card Number *
                </label>
                <input
                  type="text"
                  id="pan_card"
                  name="pan_card"
                  required
                  value={formData.pan_card}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="business_name" className="block text-sm font-medium text-slate-700">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="business_name"
                  name="business_name"
                  required
                  value={formData.business_name}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Banking Information */}
        {step === 4 && (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Banking Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="bank_account_number" className="block text-sm font-medium text-slate-700">
                  Bank Account Number *
                </label>
                <input
                  type="text"
                  id="bank_account_number"
                  name="bank_account_number"
                  required
                  value={formData.bank_account_number}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="ifsc_code" className="block text-sm font-medium text-slate-700">
                  IFSC Code *
                </label>
                <input
                  type="text"
                  id="ifsc_code"
                  name="ifsc_code"
                  required
                  value={formData.ifsc_code}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="bank_statement" className="block text-sm font-medium text-slate-700">
                  Cancelled Cheque or Bank Statement *
                </label>
                <input
                  type="file"
                  id="bank_statement"
                  name="bank_statement"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  onChange={handleFileChange}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Address Proof */}
        {step === 5 && (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Address Proof</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="address_proof" className="block text-sm font-medium text-slate-700">
                  Address Proof Document *
                </label>
                <p className="mt-1 text-xs text-slate-500">
                  Upload utility bill, rental agreement, or property papers
                </p>
                <input
                  type="file"
                  id="address_proof"
                  name="address_proof"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  onChange={handleFileChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Additional Documents */}
        {step === 6 && (
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Additional Documents (Optional)</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="trademark_certificate" className="block text-sm font-medium text-slate-700">
                  Trademark Certificate
                </label>
                <p className="mt-1 text-xs text-slate-500">
                  If selling branded products
                </p>
                <input
                  type="file"
                  id="trademark_certificate"
                  name="trademark_certificate"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="authorization_letter" className="block text-sm font-medium text-slate-700">
                  Authorization Letter
                </label>
                <p className="mt-1 text-xs text-slate-500">
                  If you are not the brand owner but authorized to sell
                </p>
                <input
                  type="file"
                  id="authorization_letter"
                  name="authorization_letter"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {errorMessage?.error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage.error}
          </div>
        )}

        <div className="flex gap-4">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back
            </button>
          )}
          <div className={step > 1 ? "flex-1" : "w-full"}>
            <SubmitButton step={step} totalSteps={totalSteps} />
          </div>
        </div>
      </form>
    </div>
  );
}

