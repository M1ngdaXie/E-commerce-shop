import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    const user = req.user;
    const coupons = await Coupon.findOne({ userId: user._id, isActive: true });
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Error fetching coupons", error });
  }
};
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const user = req.user;

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({
      code: code,
      userId: user._id,
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid or expired coupon" });
    }
    if (new Date() > coupon.expirationDate) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({ message: "Coupon has expired" });
    }
    res.status(200).json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    res.status(500).json({ message: "Error validating coupon", error });
  }
};
