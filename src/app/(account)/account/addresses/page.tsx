"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressFormData } from "@/lib/validations/address";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Star,
  Loader2,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";

type Address = {
  id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
};

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu",
  "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
];

function AddressForm({
  defaultValues,
  onSave,
  onCancel,
}: {
  defaultValues?: Partial<AddressFormData>;
  onSave: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(addressSchema) as any,
    defaultValues: {
      country: "India",
      is_default: false,
      ...defaultValues,
    },
  });

  const fieldClass =
    "border-[rgba(47,41,38,0.12)] bg-white focus-visible:ring-[#CDA4B5]";
  const labelClass = "text-[#2F2926] text-sm";
  const errorClass = "text-xs text-red-600";

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="rounded-xl border border-[rgba(47,41,38,0.1)] bg-white p-5 space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="label" className={labelClass}>
            Label <span className="text-[#7D7068] text-xs">(e.g. Home, Work)</span>
          </Label>
          <Input id="label" {...register("label")} placeholder="Home" className={fieldClass} />
          {errors.label && <p className={errorClass}>{errors.label.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="full_name" className={labelClass}>Full Name</Label>
          <Input id="full_name" {...register("full_name")} placeholder="Ananya Sharma" className={fieldClass} />
          {errors.full_name && <p className={errorClass}>{errors.full_name.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone" className={labelClass}>Phone</Label>
        <Input id="phone" type="tel" {...register("phone")} placeholder="+91 98765 43210" className={fieldClass} />
        {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address_line_1" className={labelClass}>Address Line 1</Label>
        <Input id="address_line_1" {...register("address_line_1")} placeholder="Flat 4B, Rose Apartments, MG Road" className={fieldClass} />
        {errors.address_line_1 && <p className={errorClass}>{errors.address_line_1.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address_line_2" className={labelClass}>
          Address Line 2 <span className="text-[#7D7068] text-xs">(optional)</span>
        </Label>
        <Input id="address_line_2" {...register("address_line_2")} placeholder="Near City Park" className={fieldClass} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="city" className={labelClass}>City</Label>
          <Input id="city" {...register("city")} placeholder="Mumbai" className={fieldClass} />
          {errors.city && <p className={errorClass}>{errors.city.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="state" className={labelClass}>State</Label>
          <select
            id="state"
            {...register("state")}
            className="flex h-9 w-full rounded-md border border-[rgba(47,41,38,0.12)] bg-white px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#CDA4B5] text-[#2F2926]"
          >
            <option value="">Select state</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.state && <p className={errorClass}>{errors.state.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="postal_code" className={labelClass}>PIN Code</Label>
          <Input id="postal_code" {...register("postal_code")} placeholder="400001" maxLength={6} className={fieldClass} />
          {errors.postal_code && <p className={errorClass}>{errors.postal_code.message}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="is_default"
          type="checkbox"
          {...register("is_default")}
          className="h-4 w-4 rounded border-[rgba(47,41,38,0.2)] accent-[#CDA4B5] cursor-pointer"
        />
        <Label htmlFor="is_default" className="text-sm text-[#2F2926] cursor-pointer">
          Set as default address
        </Label>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer bg-[#2F2926] text-[#F8F4EF] hover:bg-[#2F2926]/90"
        >
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>
          ) : (
            <><Check className="mr-2 h-4 w-4" /> Save Address</>
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="cursor-pointer text-[#7D7068]"
        >
          <X className="mr-1.5 h-4 w-4" /> Cancel
        </Button>
      </div>
    </form>
  );
}

export default function AddressesPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: true });
    setAddresses(data ?? []);
    setLoading(false);
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const handleAdd = async (data: AddressFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("addresses").insert({
      user_id: user!.id,
      label: data.label,
      full_name: data.full_name,
      phone: data.phone,
      address_line_1: data.address_line_1,
      address_line_2: data.address_line_2 || null,
      city: data.city,
      state: data.state,
      postal_code: data.postal_code,
      country: data.country || "India",
      is_default: data.is_default,
    });
    if (error) { toast.error("Failed to save address"); return; }
    if (data.is_default) await clearOtherDefaults(null);
    toast.success("Address saved");
    setShowAdd(false);
    load();
  };

  const handleEdit = async (id: string, data: AddressFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("addresses").update({
      label: data.label,
      full_name: data.full_name,
      phone: data.phone,
      address_line_1: data.address_line_1,
      address_line_2: data.address_line_2 || null,
      city: data.city,
      state: data.state,
      postal_code: data.postal_code,
      country: data.country || "India",
      is_default: data.is_default,
    }).eq("id", id);
    if (error) { toast.error("Failed to update address"); return; }
    if (data.is_default) await clearOtherDefaults(id);
    toast.success("Address updated");
    setEditingId(null);
    load();
  };

  const handleDelete = async (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("addresses").delete().eq("id", id);
    if (error) { toast.error("Failed to delete address"); return; }
    toast.success("Address removed");
    load();
  };

  const handleSetDefault = async (id: string) => {
    await clearOtherDefaults(id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("addresses").update({ is_default: true }).eq("id", id);
    toast.success("Default address updated");
    load();
  };

  const clearOtherDefaults = async (keepId: string | null) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q = (supabase as any)
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user!.id);
    if (keepId) q = q.neq("id", keepId);
    await q;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#7D7068]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-light text-[#2F2926]">
            My Addresses
          </h2>
          <p className="mt-1 text-sm text-[#7D7068]">
            Saved delivery addresses
          </p>
        </div>
        {!showAdd && (
          <Button
            onClick={() => { setShowAdd(true); setEditingId(null); }}
            className="cursor-pointer bg-[#2F2926] text-[#F8F4EF] hover:bg-[#2F2926]/90 gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Address
          </Button>
        )}
      </div>

      <Separator className="bg-[rgba(47,41,38,0.08)]" />

      {showAdd && (
        <AddressForm
          onSave={handleAdd}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {addresses.length === 0 && !showAdd ? (
        <div className="text-center py-16 space-y-5">
          <div className="mx-auto w-14 h-14 rounded-full bg-[#F3E7E0] flex items-center justify-center">
            <MapPin className="h-6 w-6 text-[#7D7068]" />
          </div>
          <div>
            <p className="font-[family-name:var(--font-cormorant)] text-xl text-[#2F2926] mb-1">
              No addresses saved
            </p>
            <p className="text-sm text-[#7D7068]">
              Add a delivery address to speed up checkout.
            </p>
          </div>
          <Button
            onClick={() => setShowAdd(true)}
            className="cursor-pointer bg-[#2F2926] text-[#F8F4EF] hover:bg-[#2F2926]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Address
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) =>
            editingId === addr.id ? (
              <AddressForm
                key={addr.id}
                defaultValues={{
                  label: addr.label,
                  full_name: addr.full_name,
                  phone: addr.phone,
                  address_line_1: addr.address_line_1,
                  address_line_2: addr.address_line_2 ?? "",
                  city: addr.city,
                  state: addr.state,
                  postal_code: addr.postal_code,
                  country: addr.country,
                  is_default: addr.is_default,
                }}
                onSave={(data) => handleEdit(addr.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div
                key={addr.id}
                className={`rounded-xl border bg-white p-5 transition-shadow hover:shadow-sm ${
                  addr.is_default
                    ? "border-[#CDA4B5]/40 ring-1 ring-[#CDA4B5]/20"
                    : "border-[rgba(47,41,38,0.08)]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-widest text-[#7D7068] bg-[#F3E7E0] px-2 py-0.5 rounded">
                      {addr.label}
                    </span>
                    {addr.is_default && (
                      <span className="flex items-center gap-1 text-xs text-[#CDA4B5] font-medium">
                        <Star className="h-3 w-3 fill-[#CDA4B5]" />
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!addr.is_default && (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        title="Set as default"
                        className="cursor-pointer p-1.5 rounded-md text-[#7D7068] hover:text-[#B89A6A] hover:bg-[#F3E7E0] transition-colors"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => { setEditingId(addr.id); setShowAdd(false); }}
                      title="Edit"
                      className="cursor-pointer p-1.5 rounded-md text-[#7D7068] hover:text-[#2F2926] hover:bg-[#F3E7E0] transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      title="Delete"
                      className="cursor-pointer p-1.5 rounded-md text-[#7D7068] hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-sm text-[#2F2926] space-y-0.5">
                  <p className="font-medium">{addr.full_name}</p>
                  <p className="text-[#7D7068]">{addr.phone}</p>
                  <p>{addr.address_line_1}</p>
                  {addr.address_line_2 && <p>{addr.address_line_2}</p>}
                  <p>
                    {addr.city}, {addr.state} — {addr.postal_code}
                  </p>
                  <p className="text-[#7D7068]">{addr.country}</p>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
