"use client";

import { useState } from "react";
import { Tag, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/providers/cart-provider";

export default function CouponInput() {
  const { coupon, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  if (coupon) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-[#E8D2D9]/20 border border-[#CDA4B5]/20 px-3 py-2">
        <Tag className="h-3.5 w-3.5 text-[#CDA4B5]" />
        <span className="text-sm text-[#2F2926] font-medium flex-1">
          {coupon.code}
        </span>
        <span className="text-xs text-[#7D7068]">
          {coupon.discount_type === "percentage"
            ? `${coupon.discount_value}% off`
            : `₹${coupon.discount_value} off`}
        </span>
        <button
          onClick={removeCoupon}
          className="text-[#7D7068] hover:text-[#2F2926] cursor-pointer"
          aria-label="Remove coupon"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  const handleApply = async () => {
    if (!code.trim()) return;
    setError(null);
    setIsApplying(true);
    const err = await applyCoupon(code);
    if (err) {
      setError(err);
    } else {
      setCode("");
    }
    setIsApplying(false);
  };

  return (
    <div>
      <div className="flex gap-2">
        <Input
          placeholder="Coupon code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          className="flex-1 text-sm uppercase tracking-wider border-[rgba(47,41,38,0.12)]"
        />
        <Button
          variant="outline"
          onClick={handleApply}
          disabled={isApplying || !code.trim()}
          className="cursor-pointer border-[rgba(47,41,38,0.12)] text-xs uppercase tracking-wider"
        >
          {isApplying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Apply"}
        </Button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}
