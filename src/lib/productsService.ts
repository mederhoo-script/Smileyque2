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
