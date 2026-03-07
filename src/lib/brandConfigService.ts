/**
 * Firestore CRUD helpers for the brand configuration document.
 *
 * The config is stored as a single document at:
 *   collection: "config"
 *   document:   "brand"
 *
 * If that document does not exist the application falls back to the static
 * defaults in @/config/brand.
 */

import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { brand } from "@/config/brand";

export const BRAND_CONFIG_COLLECTION = "config";
export const BRAND_CONFIG_DOC_ID = "brand";

/** The editable subset of brand settings stored in Firestore. */
export interface BrandConfig {
  brandName: string;
  logo: string;
  tagline: string;
  subTagline: string;
  whatsappNumber: string;
  phone: string;
  location: string;
  email: string;
  heroImage: string;
  heroImage2: string;
  aboutImage: string;
  designerImage: string;
  instagram: string;
  facebook: string;
  whatsappGreeting: string;
  whatsappClosing: string;
}

/** Static default values taken from the bundled brand.ts file. */
export const DEFAULT_BRAND_CONFIG: BrandConfig = {
  brandName: brand.brandName,
  logo: brand.logo,
  tagline: brand.tagline,
  subTagline: brand.subTagline,
  whatsappNumber: brand.whatsappNumber,
  phone: brand.phone,
  location: brand.location,
  email: brand.email,
  heroImage: brand.heroImage,
  heroImage2: brand.heroImage2,
  aboutImage: brand.aboutImage,
  designerImage: brand.designerImage,
  instagram: brand.instagram,
  facebook: brand.facebook,
  whatsappGreeting: brand.whatsappGreeting,
  whatsappClosing: brand.whatsappClosing,
};

/**
 * Fetch the brand config from Firestore.
 * Returns `null` if the document does not exist (caller should fall back to
 * `DEFAULT_BRAND_CONFIG`).
 */
export async function getBrandConfig(): Promise<BrandConfig | null> {
  const snap = await getDoc(
    doc(db, BRAND_CONFIG_COLLECTION, BRAND_CONFIG_DOC_ID)
  );
  if (!snap.exists()) return null;
  // Strip internal Firestore fields before returning
  const { updatedAt: _ts, ...rest } = snap.data() as BrandConfig & {
    updatedAt?: unknown;
  };
  return rest as BrandConfig;
}

/**
 * Persist the brand config to Firestore (create or overwrite).
 */
export async function saveBrandConfig(data: BrandConfig): Promise<void> {
  await setDoc(
    doc(db, BRAND_CONFIG_COLLECTION, BRAND_CONFIG_DOC_ID),
    { ...data, updatedAt: serverTimestamp() }
  );
}

/**
 * Delete the Firestore brand config document, reverting to static defaults.
 */
export async function resetBrandConfig(): Promise<void> {
  await deleteDoc(doc(db, BRAND_CONFIG_COLLECTION, BRAND_CONFIG_DOC_ID));
}
