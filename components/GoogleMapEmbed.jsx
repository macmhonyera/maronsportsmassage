export default function GoogleMapEmbed() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.4061913542682!2d31.04896752600389!3d-17.81958362607727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931a55762556451%3A0x96d20cb86fabe1fd!2sMaron%20Fitness%20%7C%20Massage%20%26Spa!5e0!3m2!1sen!2szw!4v1767628049936!5m2!1sen!2szw"
        className="h-80 w-full"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Maron Fitness | Massage & Spa Location"
      />
    </div>
  );
}
