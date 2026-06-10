import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CustomOrderActions from "@/components/admin/CustomOrderActions";

const statusColors: Record<string, string> = {
  pending: "border-gold/20 bg-gold/10 text-gold",
  reviewed: "border-blue-200 bg-blue-50 text-blue-600",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-600",
  rejected: "border-red-200 bg-red-50 text-red-600",
  priced: "border-indigo-200 bg-indigo-50 text-indigo-600",
  converted: "border-green-200 bg-green-50 text-green-700",
  in_production: "border-dusty-rose/20 bg-dusty-rose/10 text-dusty-rose",
  completed: "border-green-200 bg-green-50 text-green-700",
};

const MOCK_REQUESTS: Record<string, any> = {
  cr1: { id: "cr1", customer_name: "Priya Mehra", customer_email: "priya.m@gmail.com", customer_phone: "+91 98765 43210", flower_types: ["Pink roses", "White lilies"], colors: ["Blush pink", "Ivory"], bouquet_size: "large", wrapping_style: "Kraft paper", ribbon_style: "Satin gold", greeting_card: true, card_message: "Happy Anniversary darling!", special_notes: "Needs to be extra romantic", delivery_date: "2025-06-14", status: "pending", estimated_price: null, admin_notes: null, created_at: "2025-06-07T10:00:00Z" },
  cr2: { id: "cr2", customer_name: "Aarav Patel", customer_email: "aarav.p@gmail.com", customer_phone: "+91 65432 10987", flower_types: ["Sunflowers", "Lavender"], colors: ["Yellow", "Purple"], bouquet_size: "medium", wrapping_style: "Tissue paper", ribbon_style: null, greeting_card: false, card_message: null, special_notes: null, delivery_date: "2025-06-10", status: "in_production", estimated_price: 1799, admin_notes: "Started crafting, sunflowers done", created_at: "2025-06-05T14:30:00Z" },
  cr3: { id: "cr3", customer_name: "Neha Joshi", customer_email: "neha.j@gmail.com", customer_phone: "+91 54321 09876", flower_types: ["Blue lilies"], colors: ["Royal blue", "Gold"], bouquet_size: "premium", wrapping_style: "Velvet box", ribbon_style: "Gold metallic", greeting_card: true, card_message: "You deserve the best!", special_notes: "Gift for mother's promotion", delivery_date: "2025-06-08", status: "completed", estimated_price: 2499, admin_notes: "Beautiful outcome, client loved it", created_at: "2025-05-30T09:15:00Z" },
  cr4: { id: "cr4", customer_name: "Riya Kapoor", customer_email: "riya.k@outlook.com", customer_phone: null, flower_types: ["Mixed pastels"], colors: ["Pastel rainbow"], bouquet_size: "small", wrapping_style: null, ribbon_style: null, greeting_card: false, card_message: null, special_notes: "Surprise for roommate birthday", delivery_date: "2025-06-15", status: "pending", estimated_price: null, admin_notes: null, created_at: "2025-06-08T16:45:00Z" },
};

type Props = { params: Promise<{ id: string }> };

export default async function AdminCustomOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: dbRequest } = await (supabase as any)
    .from("custom_bouquet_requests")
    .select("*")
    .eq("id", id)
    .single();

  const request = dbRequest ?? MOCK_REQUESTS[id];
  if (!request) notFound();

  const isMock = !!MOCK_REQUESTS[id] && !dbRequest;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/custom-orders" className="flex h-8 w-8 items-center justify-center rounded-lg border border-charcoal/8 text-muted transition-colors hover:text-charcoal">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-light text-charcoal">Custom Order</h1>
          <p className="text-[11px] font-light text-muted">
            from {request.customer_name} · {new Date(request.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <Badge variant="secondary" className={`ml-auto rounded-full border text-xs ${statusColors[request.status] ?? ""}`}>
          {request.status.replace(/_/g, " ")}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-medium text-charcoal mb-4">Bouquet Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Flowers</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {(Array.isArray(request.flower_types) ? request.flower_types : [request.flowers]).map((f: string, i: number) => (
                    <Badge key={i} variant="secondary" className="rounded-full border border-dusty-rose/20 bg-dusty-rose/5 text-dusty-rose text-xs">
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Colors</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {(Array.isArray(request.colors) ? request.colors : [request.colors]).map((c: string, i: number) => (
                    <Badge key={i} variant="secondary" className="rounded-full border border-gold/20 bg-gold/5 text-gold text-xs">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Size</p>
                <p className="mt-1 text-sm capitalize text-charcoal">{request.bouquet_size}</p>
              </div>
              {request.wrapping_style && (
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Wrapping</p>
                  <p className="mt-1 text-sm text-charcoal">{request.wrapping_style}</p>
                </div>
              )}
              {request.ribbon_style && (
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Ribbon</p>
                  <p className="mt-1 text-sm text-charcoal">{request.ribbon_style}</p>
                </div>
              )}
              {request.delivery_date && (
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Requested Delivery</p>
                  <p className="mt-1 text-sm text-charcoal">
                    {new Date(request.delivery_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              )}
            </div>

            {request.greeting_card && request.card_message && (
              <div className="mt-6 rounded-lg border border-gold/15 bg-gold/5 p-4">
                <p className="text-[10px] font-medium uppercase tracking-wider text-gold mb-1">Card Message</p>
                <p className="text-sm italic text-charcoal">&ldquo;{request.card_message}&rdquo;</p>
              </div>
            )}

            {request.special_notes && (
              <div className="mt-4">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Special Notes</p>
                <p className="mt-1 text-sm text-charcoal/80">{request.special_notes}</p>
              </div>
            )}
          </div>

          {request.estimated_price && (
            <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-medium text-charcoal mb-2">Pricing</h2>
              <p className="font-heading text-2xl text-charcoal">₹{request.estimated_price.toLocaleString("en-IN")}</p>
              {request.final_price && (
                <p className="text-sm text-muted">Final: ₹{request.final_price.toLocaleString("en-IN")}</p>
              )}
            </div>
          )}

          {!isMock && <CustomOrderActions requestId={id} currentStatus={request.status} />}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-medium text-charcoal mb-4">Customer</h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-charcoal">{request.customer_name}</p>
              <p className="text-muted">{request.customer_email}</p>
              {request.customer_phone && <p className="text-muted">{request.customer_phone}</p>}
            </div>
          </div>

          {request.admin_notes && (
            <div className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-medium text-charcoal mb-2">Admin Notes</h2>
              <p className="text-sm text-charcoal/80">{request.admin_notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
