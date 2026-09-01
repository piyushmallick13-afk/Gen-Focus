import { useState, useEffect } from 'react';

export function useRazorpay() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (document.getElementById('razorpay-script')) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      setIsLoaded(true);
    };
    script.onerror = () => {
      console.error('Razorpay SDK failed to load');
    };
    document.body.appendChild(script);
  }, []);

  return isLoaded;
}
