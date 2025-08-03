import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import axios from "../lib/axios"; // Make sure this imports your custom instance
import useCartStore from "../stores/useCartStore.js";

const OrderSummary = () => {
  const stripePromise = loadStripe(
    "pk_test_51RodkmIAqV6MJS4o3RFhsfsC2muN9YuEWxP1LpI3lPLwYATTBTcmemHCsHscoA1RR3vc6Z93b6vLpKXyCcI6XCx800Qk2bAwBo"
  );
  const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();
  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedSavings = savings.toFixed(2);
  const formattedTotal = total.toFixed(2);

  const handlePayment = async () => {
    try {
      // Log for debugging
      console.log("Starting checkout process...");
      console.log("Cart items:", cart);
      console.log("Applied coupon:", coupon);
      // IMPORTANT: Notice the URL doesn't include /api because it's in baseURL
      const response = await axios.post("/payment/create-checkout-session", {
        products: cart,
        couponCode: coupon ? coupon.code : null, // Make sure this matches backend parameter name
      });

      console.log("Checkout session created:", response.data);

      // Load Stripe and redirect
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });

      if (error) {
        console.error("Stripe redirect error:", error);
        toast.error("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Unable to process your payment. Please try again later.");
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Rest of your component remains the same */}
      <p className="text-xl font-semibold text-emerald-400">Order summary</p>

      <div className="space-y-4">
        {/* Price details */}
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">
              Original price
            </dt>
            <dd className="text-base font-medium text-white">
              ${formattedSubtotal}
            </dd>
          </dl>

          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Savings</dt>
              <dd className="text-base font-medium text-emerald-400">
                -${formattedSavings}
              </dd>
            </dl>
          )}

          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">
                Coupon ({coupon.code})
              </dt>
              <dd className="text-base font-medium text-emerald-400">
                -{coupon.discountPercentage}%
              </dd>
            </dl>
          )}
          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-emerald-400">
              ${formattedTotal}
            </dd>
          </dl>
        </div>

        <motion.button
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePayment}
        >
          Proceed to Checkout
        </motion.button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline"
          >
            Continue Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
