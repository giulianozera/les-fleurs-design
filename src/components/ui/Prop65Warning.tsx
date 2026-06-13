// California Proposition 65 short-form warning.
// Every product ships in a glazed ceramic vessel, so this warning applies to all products.
// TODO: confirm with supplier whether glazes are lead/cadmium-free — if certified safe this warning may be removed.

interface Prop65WarningProps {
  className?: string;
}

export function Prop65Warning({ className }: Prop65WarningProps) {
  return (
    <p
      className={`font-body text-xs text-warm-gray leading-relaxed ${className ?? ''}`}
    >
      <span aria-hidden="true">⚠️ </span>
      <strong className="font-medium text-charcoal">WARNING:</strong> This product can
      expose you to chemicals including lead, which is known to the State of California to
      cause cancer and birth defects or other reproductive harm. For more information go to{' '}
      <a
        href="https://www.P65Warnings.ca.gov"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 text-charcoal hover:text-stone transition-colors duration-200"
      >
        www.P65Warnings.ca.gov
      </a>
      .
    </p>
  );
}

export default Prop65Warning;
