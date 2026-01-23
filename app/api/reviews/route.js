export const runtime = 'nodejs';

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return Response.json({ rating: null, reviews: [], googleUrl: null });
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=rating,reviews,googleMapsUri`;

    const res = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "rating,reviews,googleMapsUri",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return Response.json({ rating: null, reviews: [], googleUrl: null });
    }

    const data = await res.json();

    const reviews = (data.reviews || []).map((r) => ({
      author: r.authorAttribution?.displayName,
      rating: r.rating,
      text: r.text?.text,
    }));

    return Response.json({
      rating: data.rating || null,
      reviews,
      googleUrl: data.googleMapsUri || null,
    });
  } catch {
    return Response.json({ rating: null, reviews: [], googleUrl: null });
  }
}
