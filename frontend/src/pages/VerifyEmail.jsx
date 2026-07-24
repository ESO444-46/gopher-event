import api from "../api/axios"
import { useState } from "react";
import { useOtpInputs } from "../components/useOtpInputs"; // Import hook
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "../components/SpinnerComponent";
import { useToast } from "../context/ToastContext";

const VerifyEmail = () => {
  const navigate = useNavigate()
  const location = useLocation();

  const [isLoading, setLoading] = useState(false)
  const { showToast } = useToast()

  const email = location.state?.email || "yourname@umn.edu"
  const { inputsRef, handleInput, handleKeyDown, handlePaste } = useOtpInputs();

  const verifyOtp = async function(event){

    try{
      event.preventDefault();
      setLoading(true)

      const otpCode = inputsRef.current
        .filter(input => input !== null)
        .map(input => input.value)
        .join("");

      const result = await api.post("/auth/verify-otp",{email,otpCode})

      const {accessToken} = result.data
      localStorage.setItem("token",accessToken)

      showToast('success', 'OTP verified!')

      setTimeout(() => {
        navigate('/events')
      }, 1000)

    }catch(error){
      const msg = error.response?.data?.message || error.message || 'Something went wrong';
      showToast('error', msg)
    }
    finally{
      setLoading(false)
    }
  }



  return (
    
    <div className="auth-page min-h-screen flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="w-full max-w-5xl">
        <div className="auth-card verify-card rounded-2xl overflow-hidden">
          {/* Header Banner */}
          <div className="auth-brand px-8 py-8 text-center">
            <div className="mx-auto h-14 w-14 bg-white rounded-xl flex items-center justify-center shadow-lg mb-3">
              <span className="text-[#7a0019] font-bold text-xl">M</span>
            </div>
            <h2 className="font-sans text-xl font-bold text-white">Verify Your Email</h2>
            <p className="mt-1 text-[#ffcc33] text-xs font-semibold uppercase tracking-wider">
              Gopher Events
            </p>
          </div>
      
          {/* Core Content Form */}
          <div className="px-8 py-8 text-center">
            <p className="text-sm text-gray-600 mb-6">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-gray-900">
                {email}
              </span>
            </p>

            <form className="space-y-6" onSubmit={verifyOtp}>
              {/* 6-Digit Array Grid Container */}
              <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    name={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    inputMode="numeric"
                    pattern="[0-9]"
                    placeholder="•"
                    required
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-14 text-center text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a0019] focus:border-[#7a0019] focus:bg-white transition-colors"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled = {isLoading}
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-[#7a0019] hover:bg-[#5a0012] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7a0019] transition-colors"
              >
              {isLoading? (<Spinner></Spinner>): "Verify Email"}

              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
