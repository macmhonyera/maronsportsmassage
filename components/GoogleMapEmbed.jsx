export default function GoogleMapEmbed() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <iframe
        src="https://maps.google.com/maps?q=264+Herbert+Chitepo+Ave,+Harare&ll=-17.8199352,31.0548965&z=17&output=embed"
        className="h-80 w-full"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Maron's Muscle Studio Location"
      />
    </div>
  );
}
