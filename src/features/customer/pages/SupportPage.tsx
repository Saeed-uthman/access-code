import { Headphones } from 'lucide-react';

export default function SupportPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Support</h1>
        <p className="mt-1 text-gray-500">
          Get help with your account or report an issue.
        </p>
      </div>

      <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
        <div>
          <Headphones className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Support Center
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            FAQ, contact form, and support resources will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
