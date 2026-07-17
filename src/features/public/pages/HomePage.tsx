import { Link } from 'react-router-dom';
import { Wifi, Shield, Zap, Globe } from 'lucide-react';

const features = [
  {
    icon: Wifi,
    title: 'Fast Connectivity',
    description: 'Blazing fast internet access with guaranteed uptime.',
  },
  {
    icon: Shield,
    title: 'Secure Access',
    description: 'Encrypted connections keep your data safe.',
  },
  {
    icon: Zap,
    title: 'Instant Activation',
    description: 'Get your access code and connect in seconds.',
  },
  {
    icon: Globe,
    title: 'Wide Coverage',
    description: 'Available across multiple locations and venues.',
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            WiFi Access Made Simple
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-100">
            Get reliable, high-speed internet access with YAROTECH. Purchase a
            plan, receive your access code, and connect instantly.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="rounded-lg bg-white px-8 py-3 text-base font-semibold text-primary-700 shadow transition-colors hover:bg-primary-50"
            >
              Get Started
            </Link>
            <Link
              to="/pricing"
              className="rounded-lg border border-white/30 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              View Plans
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Why Choose YAROTECH?
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
