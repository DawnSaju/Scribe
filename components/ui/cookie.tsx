import { CookieIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function CookieConsent() {
  const [cookieConsent, setCookieConsent] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (consent === "accepted" || consent === "declined") {
      setCookieConsent(true);
    } else {
      setCookieConsent(false);
    }
    setLoaded(true);
  }, []);

  const acceptbtn = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setCookieConsent(true);
  };

  const declinebtn = () => {
    localStorage.setItem("cookieConsent", "declined");
    setCookieConsent(true);
  };

  if (!loaded) return null;

  return (
    <div style={{display: cookieConsent ? "none" : "block"}} className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 w-full flex justify-center pointer-events-none">
      <div className="pointer-events-auto flex flex-col w-full max-w-md rounded-2xl bg-white shadow-2xl border border-black/10 gap-4 p-6 animate-fade-in">
        <div className="flex flex-row justify-between items-center mb-2">
          <h1 className="font-bold text-lg text-black">We use cookies</h1>
          <CookieIcon className="text-yellow-500" />
        </div>
        <p className="text-sm text-gray-700">
          We use cookies to ensure you get the best experience on our website. For more information on how we use cookies, please see our privacy policy.
        </p>
        <div className="flex flex-col gap-2 mt-2">
          <p className="text-xs text-gray-600">
            By clicking &quot;Accept&quot;, you agree to our use of cookies.
          </p>
          <a className="text-xs underline text-blue-600 hover:text-blue-800" href="/policy">Learn more</a>
        </div>
        <div className="flex flex-row justify-end items-center gap-3 mt-4">
          <Button onClick={declinebtn} variant={"outline"} className="w-28">Decline</Button>
          <Button onClick={acceptbtn} variant={"default"} className="w-28 bg-gradient-to-r from-[#1E78FF] to-[#8AB9FF] text-white hover:bg-black">Accept</Button>
        </div>
      </div>
    </div>
  );
}