export default function Section({ title, subtitle, children }) {
  return (
    <section className="py-12">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
        {subtitle ? <p className="mt-3 text-slate-600 text-lg">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}
