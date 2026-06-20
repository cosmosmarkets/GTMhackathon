/**
 * CTACard — Lightfern email-surface styling. Ties the portrait back to the
 * product promise: your voice, kept in every email.
 */

export default function CTACard() {
  return (
    <div className="rounded-card border border-fern/15 bg-gradient-to-br from-fern/[0.06] to-fern-bright/[0.04] p-6 text-center shadow-card">
      <p className="mx-auto max-w-md font-serif text-xl leading-snug text-ink sm:text-2xl">
        This is your voice. Lightfern keeps it in every email.
      </p>
      <a
        href="https://lightfern.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex min-h-[44px] items-center rounded-full bg-fern px-6 text-sm font-semibold text-paper transition hover:bg-fern/90"
      >
        See how Lightfern works
      </a>
    </div>
  );
}
