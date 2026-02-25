"use client";

function moneyUSD(amount) {
  return `$${Number(amount).toFixed(0)}`;
}

export default function AddOnCarousel({ items }) {
  // Duplicate items for seamless looping
  const loopItems = [...items, ...items];

  return (
    <div className="mt-10 relative overflow-hidden">
      <div className="marquee flex gap-4">
        {loopItems.map((a, index) => (
          <div
            key={index}
            className="min-w-[280px] sm:min-w-[320px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {a.name}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  {a.tagline}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Add-on</div>
                <div className="text-lg font-semibold text-[#0F172A]">
                  {moneyUSD(a.price)}
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Book this add-on as a standalone appointment or include it with a service.
            </p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .marquee {
          width: max-content;
          animation: scroll 30s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}