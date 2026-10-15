import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";
import { isValidUuid } from "../../../utils/uuidUtils";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3333/api/b2c";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mking.com.mx";
const FALLBACK_IMAGE = `${SITE_URL}/images/logo-share.jpg`;

// Se ejecuta en el servidor para que WhatsApp/Facebook (que no ejecutan JS) vean imagen, nombre y precio
async function fetchProduct(identifier: string) {
  const path = isValidUuid(identifier) ? `products/uuid/${identifier}` : `products/${parseInt(identifier)}`;
  try {
    const res = await fetch(`${API_URL}/${path}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Misma lógica que ProductDetail: imagen principal, luego la primera, luego img_product
function getImageUrl(product: any): string {
  let url = "";
  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  if (images.length > 0) {
    const primary = images.find((img: any) => img.is_primary === 1 || img.is_primary === true || img.is_primary === "1");
    const target = primary || images[0];
    url = typeof target === "string" ? target : target?.url || target?.image_path || "";
  }
  if (!url && product.img_product) url = product.img_product;
  if (!url) return FALLBACK_IMAGE;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function generateMetadata({ params }: { params: { uuid: string } }): Promise<Metadata> {
  const product = await fetchProduct(params.uuid);
  if (!product) return {};

  const name = String(product.name).trim();

  const price = `$${Number(product.price).toFixed(2)} MXN`;
  const title = `${name} | MKing`;
  const description = `${name} - ${price}. ${
    product.description ? product.description.substring(0, 120) : "Chaleco de seguridad industrial de alta calidad"
  }`;
  const image = getImageUrl(product);
  const url = `${SITE_URL}/producto/${params.uuid}`;

  return {
    title: `${name} | Chaleco de Seguridad Industrial - MKing México`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: "MKing Ecommerce",
      url,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function Page() {
  return <ProductDetailClient />;
}
