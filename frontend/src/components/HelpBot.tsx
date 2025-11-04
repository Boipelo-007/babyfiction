"use client";
import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const HelpBot = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-3 w-72 rounded-lg border bg-white shadow-lg">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <div className="text-sm font-semibold">Do you need help?</div>
            <button
              aria-label="Close help"
              className="rounded p-1 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="px-3 py-3 text-sm text-gray-700">
            Hi! I’m here to help. You can:
            <ul className="mt-2 list-disc pl-5">
              <li>Check your orders on the Account page</li>
              <li>Browse products and promotions</li>
              <li>Ask about Black Friday subscriptions</li>
            </ul>
            <div className="mt-3">
              <a
                href="mailto:support@babyfiction.example.com?subject=Help%20Request"
                className="text-blue-600 underline"
              >
                Email support
              </a>
            </div>
          </div>
        </div>
      )}
      <button
        aria-label="Open help"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg hover:bg-gray-900"
        onClick={() => setOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
};

export default HelpBot;