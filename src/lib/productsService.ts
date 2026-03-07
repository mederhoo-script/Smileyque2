/**
 * Firestore CRUD helpers for the "products" collection.
 *
 * Collection schema mirrors the Product interface from @/data/products, with
 * an additional `createdAt` server timestamp added on write.
 */

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/data/products";

export const PRODUCTS_COLLECTION = "products";

/** Shape stored in Firestore (Product fields + server timestamp). */
export interface FirestoreProductDoc extends Omit<Product, "id"> {
  createdAt?: Timestamp;
}

/** Convert a Firestore document snapshot to a typed Product. */
function toProduct(snap: QueryDocumentSnapshot<DocumentData>): Product {
  const data = snap.data() as FirestoreProductDoc;
  const { createdAt: _ts, ...rest } = data;
  return { id: snap.id, ...rest } as Product;
}

/**
 * Save a new product to Firestore.
 * @returns The auto-generated Firestore document ID.
 */
export async function addProduct(data: Omit<Product, "id">): Promise<string> {
  const ref = await addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Fetch all products from Firestore, ordered newest-first.
 */
export async function getProducts(): Promise<Product[]> {
  const q = query(
    collection(db, PRODUCTS_COLLECTION),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(toProduct);
}

/**
 * Delete a product document from Firestore by its document ID.
 */
export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
}

/**
 * Update an existing product document in Firestore.
 * Only the supplied fields are overwritten; `createdAt` is preserved.
 */
export async function updateProduct(id: string, data: Omit<Product, "id">): Promise<void> {
  await updateDoc(doc(db, PRODUCTS_COLLECTION, id), { ...data });
}

/**
 * Upload a product image file to Cloudinary using an unsigned upload preset.
 *
 * The returned URL is a permanent Cloudinary delivery URL that can be stored
 * directly in Firestore. No Firebase Storage bucket is required.
 *
 * Required environment variables (see example.env):
 *   VITE_CLOUDINARY_CLOUD_NAME   – your Cloudinary cloud name
 *   VITE_CLOUDINARY_UPLOAD_PRESET – an *unsigned* upload preset created in the
 *                                   Cloudinary dashboard (Settings → Upload →
 *                                   Upload presets → Signing Mode: Unsigned)
 *
 * A 30-second `Promise.race` timeout guards against stalled uploads.
 *
 * @param file       The image File object selected by the user.
 * @param view       Semantic view name — "front" | "left" | "right" | "back".
 * @param timeoutMs  Milliseconds before the upload is considered timed out.
 * @returns          The public Cloudinary URL for the uploaded image.
 */
export async function uploadProductImage(
  file: File,
  view: "front" | "left" | "right" | "back",
  timeoutMs = 30_000
): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and " +
        "VITE_CLOUDINARY_UPLOAD_PRESET in your .env file (see example.env)."
    );
  }

  // Tag images with the product view so they are easy to find in the Cloudinary
  // Media Library and so that Cloudinary transformations can be applied per view.
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "products");
  formData.append("tags", `view:${view}`);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const uploadPromise = fetch(uploadUrl, {
    method: "POST",
    body: formData,
  }).then(async (res) => {
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      throw new Error(`Cloudinary upload failed (${res.status}): ${text}`);
    }
    const json = (await res.json()) as { secure_url?: string };
    if (!json.secure_url) {
      throw new Error(
        "Cloudinary upload succeeded but the response did not contain a secure_url. " +
          "Check your upload preset configuration in the Cloudinary dashboard."
      );
    }
    return json.secure_url;
  });

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () =>
        reject(
          new Error(
            `Image upload timed out after ${timeoutMs / 1000}s. ` +
              "Check your internet connection and Cloudinary upload-preset settings."
          )
        ),
      timeoutMs
    )
  );

  return Promise.race([uploadPromise, timeoutPromise]);
}

