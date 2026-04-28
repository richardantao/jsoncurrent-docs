import type { Metadata } from "next";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import type { FC } from "react";
import "nextra-theme-docs/style.css";

export const metadata: Metadata = {
  title: "jsoncurrent Docs",
};

// const banner = <Banner storageKey="some-key">Nextra 4.0 is released 🎉</Banner>;
const navbar = (
  <Navbar
    logo={<b>jsoncurrent</b>}
    // ... Your additional navbar options
  />
);
const footer = <Footer>MIT {new Date().getFullYear()} © jsoncurrent.</Footer>;

const RootLayout: FC<LayoutProps<"/">> = async ({ children }) => {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head></Head>
      <body>
        <Layout
          // banner={banner}
          navbar={navbar}
          sidebar={{
            toggleButton: true,
            autoCollapse: true,
            defaultOpen: true,
          }}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/richardantao/jsoncurrent-docs"
          footer={footer}
          navigation={{ next: true, prev: true }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
};

export default RootLayout;
