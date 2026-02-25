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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
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
 * Upload a product image file to Firebase Storage.
 *
 * Files are stored under `products/{timestamp}_{view}_{originalFilename}`.
 * @param file  The image File object selected by the user.
 * @param view  Semantic view name — "front" | "left" | "right" | "back".
 * @returns     The public download URL for the uploaded image.
 */
export async function uploadProductImage(
  file: File,
  view: "front" | "left" | "right" | "back"
): Promise<string> {
  // Sanitize: keep only the base filename (strip any path separators) and
  // remove characters that are not safe for Storage object names.
  const safeName = file.name
    .replace(/[/\\]/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "_");

  // Use crypto.randomUUID for a guaranteed-unique prefix even under concurrent uploads.
  const unique = `${Date.now()}_${crypto.randomUUID()}`;
  const path = `products/${unique}_${view}_${safeName}`;

  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}
