import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Daily Pass',
    type: 'individual',
    price: 500,
    validity: '1 Day',
    features: ['1 Device', 'Unlimited Data', 'Fast Speeds', '24h Access'],
  },
  {
    name: 'Weekly Plan',
    type: 'individual',
    price: 2500,
    validity: '7 Days',
    features: [
      '2 Devices',
      'Unlimited Data',
      'Fast Speeds',
      '7 Days Access',
      'Priority Support',
    ],
  },
  {
    name: 'Monthly Plan',
    type: 'house',
    price: 8000,
    validity: '30 Days',
    features: [
      '5 Devices',
      'Unlimited Data',
      'Fast Speeds',
      '30 Days Access',
      'Priority Support',
      'Parental Controls',
    ],
  },
  {
    name: 'Yearly Plan',
    type: 'business',
    price: 80000,
    validity: '365 Days',
    features: [
      'Unlimited Devices',
      'Unlimited Data',
      'Fastest Speeds',
      '365 Days Access',
      '24/7 Support',
      'Parental Controls',
      'Business Features',
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            Choose a plan that fits your needs. No hidden fees, no surprises.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{plan.validity}</p>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900">
                  &#8358;{plan.price.toLocaleString()}
                </span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <Check className="h-4 w-4 shrink-0 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-8 w-full rounded-lg border border-primary-600 px-4 py-2.5 text-sm font-semibold text-primary-600 transition-colors hover:bg-primary-50"
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
