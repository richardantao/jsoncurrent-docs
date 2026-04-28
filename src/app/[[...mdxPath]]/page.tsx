import type { FC } from "react";
import { notFound, redirect } from "next/navigation";
import { generateStaticParamsFor, importPage } from "nextra/pages";
import type { PageMapItem } from "nextra";
import { getPageMap } from "nextra/page-map";

import { useMDXComponents as getMDXComponents } from "~/mdx-components";

export const generateStaticParams = generateStaticParamsFor("mdxPath");

function findFolderByRoute(
  items: PageMapItem[],
  route: string,
): Extract<PageMapItem, { children: PageMapItem[] }> | undefined {
  for (const item of items) {
    if ("children" in item) {
      if (item.route === route) {
        return item;
      }

      const nestedFolder = findFolderByRoute(item.children, route);
      if (nestedFolder) {
        return nestedFolder;
      }
    }
  }
}

function findFirstPageRoute(items: PageMapItem[]): string | undefined {
  for (const item of items) {
    if ("frontMatter" in item) {
      return item.route;
    }

    if ("children" in item) {
      const firstChildRoute = findFirstPageRoute(item.children);
      if (firstChildRoute) {
        return firstChildRoute;
      }
    }
  }
}

function hasPageRoute(items: PageMapItem[], route: string): boolean {
  for (const item of items) {
    if ("frontMatter" in item && item.route === route) {
      return true;
    }

    if ("children" in item && hasPageRoute(item.children, route)) {
      return true;
    }
  }

  return false;
}

async function resolvePagePath(mdxPath: string[] | undefined) {
  const pathSegments = mdxPath ?? [];

  if (pathSegments.length === 0) {
    return { importPath: pathSegments };
  }

  const requestedRoute = `/${pathSegments.join("/")}`;
  const pageMap = await getPageMap();

  if (hasPageRoute(pageMap, requestedRoute)) {
    return { importPath: pathSegments };
  }

  const folder = findFolderByRoute(pageMap, requestedRoute);
  if (!folder) {
    return { notFound: true as const };
  }

  const hasOwnPage = folder.children.some(
    (item) => "frontMatter" in item && item.route === requestedRoute,
  );
  if (hasOwnPage) {
    return { importPath: pathSegments };
  }

  const redirectTo = findFirstPageRoute(folder.children);
  if (!redirectTo) {
    return { notFound: true as const };
  }

  return {
    importPath: redirectTo.slice(1).split("/"),
    redirectTo,
  };
}

export const generateMetadata = async (props: PageProps<"/[[...mdxPath]]">) => {
  const params = await props.params;
  const resolved = await resolvePagePath(params.mdxPath);
  if (resolved.notFound) {
    notFound();
  }

  const { importPath } = resolved;
  const { metadata } = await importPage(importPath);
  return metadata;
};

const Wrapper = getMDXComponents().wrapper;

const MdxPathPage: FC<PageProps<"/[[...mdxPath]]">> = async (props) => {
  const params = await props.params;
  const resolved = await resolvePagePath(params.mdxPath);

  if (resolved.notFound) {
    notFound();
  }

  const { importPath, redirectTo } = resolved;

  if (redirectTo) {
    redirect(redirectTo);
  }

  const {
    default: MDXContent,
    toc,
    metadata,
    sourceCode,
  } = await importPage(importPath);
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
};

export default MdxPathPage;
