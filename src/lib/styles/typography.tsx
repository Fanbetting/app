type Children = { children: React.ReactNode };

type TextProps = Children & {
  variant:
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "muted"
  | "large"
  | "small"
  | "quote"
  | "code"
  | "lead";
};

function TypographyH1({ children }: Children) {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {children}
    </h1>
  );
}

function TypographyH2({ children }: Children) {
  return (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
      {children}
    </h2>
  );
}

function TypographyH3({ children }: Children) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {children}
    </h3>
  );
}
function TypographyH4({ children }: Children) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      {children}
    </h4>
  );
}

function TypographyP({ children }: Children) {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
}

function TypographyBlockquote({ children }: Children) {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>
  );
}

function TypographyInlineCode({ children }: Children) {
  return (
    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
      {children}
    </code>
  );
}

function TypographyLead({ children }: Children) {
  return <p className="text-xl text-muted-foreground">{children}</p>;
}

function TypographyLarge({ children }: Children) {
  return <div className="text-lg font-semibold">{children}</div>;
}

function TypographySmall({ children }: Children) {
  return <small className="text-sm font-medium leading-none">{children}</small>;
}

function TypographyMuted({ children }: Children) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

export function Text({ variant, children }: TextProps) {
  switch (variant) {
    case "h1": {
      return <TypographyH1>{children}</TypographyH1>;
    }

    case "h2": {
      return <TypographyH2>{children}</TypographyH2>;
    }

    case "h3": {
      return <TypographyH3>{children}</TypographyH3>;
    }

    case "h4": {
      return <TypographyH4>{children}</TypographyH4>;
    }

    case "p": {
      return <TypographyP>{children}</TypographyP>;
    }

    case "muted": {
      return <TypographyMuted>{children}</TypographyMuted>;
    }

    case "quote": {
      return <TypographyBlockquote>{children}</TypographyBlockquote>;
    }

    case "code": {
      return <TypographyInlineCode>{children}</TypographyInlineCode>;
    }

    case "large": {
      return <TypographyLarge>{children}</TypographyLarge>;
    }

    case "small": {
      return <TypographySmall>{children}</TypographySmall>;
    }

    case "lead": {
      return <TypographyLead>{children}</TypographyLead>;
    }

    default: {
      console.log(`Unknown variant: ${variant}`);
      return <TypographyP>{children}</TypographyP>;
    }
  }
}
