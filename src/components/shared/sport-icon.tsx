import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";

// Renders a lucide icon by name; falls back to a generic activity icon.
export function SportIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = (Icons as unknown as Record<string, React.ComponentType<LucideProps>>)[name] ?? Icons.Activity;
  return <Icon {...props} />;
}
