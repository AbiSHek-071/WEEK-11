import React, { useState } from "react";
import { useSelector } from "react-redux";

function ReferralCode() {
  const { referalCode } = useSelector((store) => store.user.userDatas);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referalCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 w-full max-w-6xl mt-5">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Snitch Referral Program
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-2">How It Works</h3>
          <p className="text-gray-600 mb-4">
            Share your referral code with friends. When someone uses your code
            after their first sign-up:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>You'll receive ₹200 in your wallet</li>
            <li>Your friend will also get ₹200 in their wallet</li>
          </ul>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex flex-col justify-center">
          <h3 className="font-semibold text-lg mb-2 text-purple-800">
            Your Referral Code
          </h3>
          <div className="flex items-center justify-between bg-white border border-purple-300 rounded-lg p-3">
            <span className="text-2xl font-bold text-purple-700">
              {referalCode}
            </span>
            <button
              onClick={copyToClipboard}
              className="text-purple-500 hover:text-purple-700 focus:outline-none transition-colors duration-200"
              aria-label="Copy referral code"
            >
              {copied ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>
          </div>
          {copied && (
            <p className="mt-2 text-sm text-green-600">Copied to clipboard!</p>
          )}
          <p className="mt-4 text-sm text-purple-600">
            Share this code with your friends to start earning rewards!
          </p>
        </div>
      </div>
    </div>
  );
}

export default ReferralCode;
