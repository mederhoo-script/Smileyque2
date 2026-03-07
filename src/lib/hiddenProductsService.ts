/**
 * Firestore service for hiding/restoring static products.
 *
 * Static products are defined in @/data/products and cannot be deleted from
 * the code, but administrators can mark them as "hidden" so they no longer
 * appear on the storefront.  The set of hidden product IDs is persisted as:
 *
 *   collection: "config"
 *   document:   "hiddenProducts"
 *   field:      hiddenIds: string[]
 *
 * Because the `config` collection is publicly readable (see firestore.rules),
 * the storefront can fetch the hidden-ID list without authentication.
 */

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState, useCallback } from "react";

const HIDDEN_PRODUCTS_REF = doc(db, "config", "hiddenProducts");

/** Fetch the current set of hidden static-product IDs from Firestore. */
export async function getHiddenProductIds(): Promise<string[]> {
  const snap = await getDoc(HIDDEN_PRODUCTS_REF);
  if (!snap.exists()) return [];
  const data = snap.data() as { hiddenIds?: string[] };
  return data.hiddenIds ?? [];
}

/** Persist an updated list of hidden IDs. */
async function saveHiddenIds(ids: string[]): Promise<void> {
  await setDoc(HIDDEN_PRODUCTS_REF, { hiddenIds: ids });
}

/**
 * Mark a static product as hidden.
 * No-op if the ID is already in the hidden list.
 */
export async function hideProduct(id: string): Promise<void> {
  const current = await getHiddenProductIds();
  if (current.includes(id)) return;
  await saveHiddenIds([...current, id]);
}

/**
 * Restore a previously hidden static product (remove from hidden list).
 * No-op if the ID is not currently hidden.
 */
export async function restoreProduct(id: string): Promise<void> {
  const current = await getHiddenProductIds();
  await saveHiddenIds(current.filter((h) => h !== id));
}

/**
 * React hook that fetches and exposes the set of hidden product IDs.
 * Suitable for storefront pages and the admin panel alike.
 */
export function useHiddenProductIds() {
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const ids = await getHiddenProductIds();
      setHiddenIds(ids);
    } catch {
      setHiddenIds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { hiddenIds, loading, refetch };
}
