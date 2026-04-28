import { useMDXComponents as getThemeComponents } from "nextra-theme-docs";

const themeComponents = getThemeComponents();

declare global {
  type MDXProvidedComponents = typeof themeComponents;
}

export function useMDXComponents(): MDXProvidedComponents {
  return themeComponents;
}
