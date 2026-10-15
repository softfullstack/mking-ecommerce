"use client";

import React from "react";
import NextLink from "next/link";
import { useRouter, useSearchParams as useNextSearchParams, useParams, usePathname } from "next/navigation";

// Polyfill de <Link as={...} to="..."> de react-router-dom hacia Next.js <Link href="...">
export const RouterLink = React.forwardRef<HTMLAnchorElement, any>(function RouterLink(
  { to, href, children, ...props },
  ref
) {
  const target = to || href || "/";
  return (
    <NextLink ref={ref} href={target} {...props}>
      {children}
    </NextLink>
  );
});

// Alias for components that import { Link } from 'react-router-dom'
export const Link = RouterLink;
export const LinkComponent = RouterLink;

// Polyfill de useNavigate
export const useNavigate = () => {
  const router = useRouter();
  return (to: string | number, options?: any) => {
    if (typeof to === "number") {
      if (to === -1) router.back();
    } else {
      if (options?.replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
    }
  };
};

// Polyfill de useLocation
export const useLocation = () => {
  let pathname = "/";
  let search = "";
  let hash = "";
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    pathname = usePathname() || "/";
  } catch {
    // fallback
  }
  if (typeof window !== "undefined") {
    search = window.location.search;
    hash = window.location.hash;
  }
  return {
    pathname,
    search,
    hash,
    state: null,
    key: "default",
  };
};

// Polyfill de useSearchParams returning [searchParams, setSearchParams]
export const useSearchParams = (): [
  URLSearchParams,
  (
    nextInit:
      | Record<string, string | number | undefined | null>
      | URLSearchParams
      | ((prev: URLSearchParams) => URLSearchParams | Record<string, string | number | undefined | null>),
    options?: { replace?: boolean }
  ) => void
] => {
  let nextSearchParams: any = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    nextSearchParams = useNextSearchParams();
  } catch {
    // fallback
  }

  const router = useRouter();
  let pathname = "/";
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    pathname = usePathname() || "/";
  } catch {
    // fallback
  }

  // Next actualiza window.location después del render, así que la fuente de verdad son sus searchParams
  const searchParams = React.useMemo(() => {
    if (nextSearchParams) {
      return new URLSearchParams(nextSearchParams.toString());
    }
    return new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  }, [nextSearchParams]);

  const setSearchParams = React.useCallback(
    (nextInit: any, options?: { replace?: boolean }) => {
      const current = new URLSearchParams(
        nextSearchParams
          ? nextSearchParams.toString()
          : typeof window !== "undefined"
            ? window.location.search
            : ""
      );

      const resolved = typeof nextInit === "function" ? nextInit(current) : nextInit;

      if (resolved instanceof URLSearchParams) {
        resolved.forEach((val: string, key: string) => current.set(key, val));
      } else if (typeof resolved === "object" && resolved !== null) {
        Object.entries(resolved).forEach(([key, val]) => {
          if (val === undefined || val === null || val === "") {
            current.delete(key);
          } else {
            current.set(key, String(val));
          }
        });
      }

      const qs = current.toString();
      const target = `${pathname}${qs ? `?${qs}` : ""}`;
      if (options?.replace) {
        router.replace(target);
      } else {
        router.push(target);
      }
    },
    [nextSearchParams, pathname, router]
  );

  return [searchParams, setSearchParams];
};

// Polyfill de Navigate (redirect component)
export const Navigate = ({ to, replace }: { to: string; replace?: boolean }) => {
  const router = useRouter();
  React.useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [to, replace, router]);
  return null;
};

// Polyfill de Outlet (renders children)
export const Outlet = ({ children }: { children?: React.ReactNode }) => {
  return <>{children}</>;
};

export { useParams };
