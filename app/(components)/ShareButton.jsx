"use client";
// components/ShareButton.jsx

import React, { useState } from "react";
import {
  FaShare,
  FaCopy,
  FaQrcode,
  FaEnvelope,
  FaComment,
} from "react-icons/fa";

const ShareButton = ({ url }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = "Check out this booklist";
    const body = `I found this interesting booklist:\n\n${url}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const shareViaText = () => {
    const message = `Check out this booklist: ${url}`;
    navigator.clipboard.writeText(message);
    alert(
      "The message has been copied to your clipboard. Please paste it into your text message."
    );
    const textLink = `sms:?body=${encodeURIComponent(message)}`;
    window.open(textLink);
  };

  const generateQRCode = () => {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      url
    )}`;
    window.open(qrCodeUrl, "_blank");
  };

  return (
    <div className="relative">
      <button
        className="bg-yellow text-primary px-4 py-2 rounded-md hover:bg-orange transition duration-300"
        onClick={toggleOptions}
      >
        <FaShare className="inline-block mr-2 text-primary" size={16} />
        Share
      </button>
      {showOptions && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
            onClick={copyToClipboard}
          >
            <FaCopy className="inline-block mr-2 text-gray-600" size={16} />
            {copySuccess ? "Copied!" : "Copy Link"}
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
            onClick={shareViaEmail}
          >
            <FaEnvelope className="inline-block mr-2 text-gray-600" size={16} />
            Share via Email
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
            onClick={shareViaText}
          >
            <FaComment className="inline-block mr-2 text-gray-600" size={16} />
            Share via Text
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
            onClick={generateQRCode}
          >
            <FaQrcode className="inline-block mr-2 text-gray-600" size={16} />
            QR Code
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
