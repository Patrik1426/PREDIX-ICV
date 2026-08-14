import { useTheme } from "@/contexts/ThemeContext";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      position="bottom-right"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-border": "var(--border)",
          "--normal-text": "var(--foreground)",
          "--success-bg": "var(--popover)",
          "--success-border": "var(--chart-2)",
          "--success-text": "var(--chart-2)",
          "--error-bg": "var(--popover)",
          "--error-border": "var(--destructive)",
          "--error-text": "var(--destructive)",
          "--warning-bg": "var(--popover)",
          "--warning-border": "var(--chart-3)",
          "--warning-text": "var(--chart-3)",
          "--info-bg": "var(--popover)",
          "--info-border": "var(--primary)",
          "--info-text": "var(--primary)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
