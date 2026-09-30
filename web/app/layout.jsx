import "@fontsource-variable/manrope/wght.css";
import "@fontsource-variable/lora/wght.css";
import "@fontsource-variable/lora/wght-italic.css";
import "./globals.css";

export const metadata = {
  title: "Breast AI | Clarity through care",
  description: "A four-view mammography review workspace under development.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
