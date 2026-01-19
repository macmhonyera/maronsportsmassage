import Image from "next/image";

export default function Reviews() {
  // Optional: set this to your Google reviews link (or your place link)
  const googleReviewsUrl =
    "https://www.google.com/maps/place/Maron+Fitness+%7C+Massage+%26Spa/@-17.8195746,31.0466653,17z/data=!4m8!3m7!1s0x1931a55762556451:0x96d20cb86fabe1fd!8m2!3d-17.8195798!4d31.0515362!9m1!1b1!16s%2Fg%2F11x7jvn9m3?entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoASAFQAw%3D%3D";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4">
        <div>
          <div className="text-sm font-medium text-[#64748B]">Google Reviews</div>
          <div className="mt-1 text-xs text-[#64748B]">Verified client feedback</div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            {/* Optional: manually set rating if you want */}
            <div className="text-3xl font-bold text-[#0F172A]">5.0</div>
            <div className="text-xs text-[#64748B]">out of 5.0</div>
          </div>
          <div className="text-2xl">⭐</div>
        </div>
      </div>

      {/* Screenshot */}
      {/* <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="relative w-full overflow-hidden rounded-lg">
            <Image
              src="/reviews/google-review.png"
              alt="Google reviews screenshot"
              width={1400}
              height={900}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
        </div>
      </div> */}
      <div className="grid gap-4 md:grid-cols-3">
  {["/reviews/review1.png", "/reviews/review2.png", "/reviews/review3.png"].map((src) => (
    <div key={src} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <Image src={src} alt="Google review screenshot" width={900} height={700} className="h-auto w-full rounded-lg object-contain" />
    </div>
  ))}
</div>


      {/* Link to Google */}
      <div className="mt-6 text-center">
        <a
          className="inline-flex items-center text-[#14B8A6] font-semibold hover:text-[#0D9488] hover:underline decoration-[#14B8A6] decoration-2 underline-offset-4"
          target="_blank"
          rel="noreferrer"
          href={googleReviewsUrl}
        >
          Read more reviews on Google
          <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>

      <p className="mt-3 text-center text-xs text-[#64748B]">
        Screenshots are sourced from Google Maps. Click the link above to view all reviews.
      </p>
    </div>
  );
}
