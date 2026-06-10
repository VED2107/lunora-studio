import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">New Product</h1>
      <p className="mt-1 mb-6 text-sm text-gray-500">Create a new product listing</p>
      <ProductForm />
    </div>
  );
}
