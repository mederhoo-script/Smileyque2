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
 * Files are stored under `products/{timestamp}_{unique}_{view}_{originalFilename}`.
 *
 * Uses `uploadBytes` (the simple Promise-based API) rather than
 * `uploadBytesResumable` so we avoid the UploadTask promise-chain quirks.
 * Content-type metadata is passed explicitly so the Firebase Storage security
 * rule `request.resource.contentType.matches('image/.*')` is satisfied.
 *
 * A 30-second `Promise.race` timeout guards against stalled uploads.
 *
 * @param file       The image File object selected by the user.
 * @param view       Semantic view name — "front" | "left" | "right" | "back".
 * @param timeoutMs  Milliseconds before the upload is considered timed out.
 * @returns          The public download URL for the uploaded image.
 */
export async function uploadProductImage(
  file: File,
  view: "front" | "left" | "right" | "back",
  timeoutMs = 30_000
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

  // Pass content-type explicitly so Firebase Storage security rules that
  // check `request.resource.contentType.matches('image/.*')` are satisfied.
  // `file.type` is set by the browser from the file's MIME type. If it is
  // empty (rare, but possible on some mobile browsers), derive it from the
  // file extension. Fall back to 'image/jpeg' as a last resort — the file
  // input already restricts selection to `accept="image/*"`, so any selected
  // file is an image and the fallback will satisfy the `image/.*` rule.
  const EXT_MIME: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    bmp: "image/bmp",
    avif: "image/avif",
  };
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const contentType = file.type || EXT_MIME[ext] || "image/jpeg";
  const metadata = { contentType };

  const uploadPromise = uploadBytes(storageRef, file, metadata).then(
    (snapshot) => getDownloadURL(snapshot.ref)
  );

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () =>
        reject(
          new Error(
            `Image upload timed out after ${timeoutMs / 1000}s. ` +
              "Ensure Firebase Storage security rules allow writes and your internet connection is stable."
          )
        ),
      timeoutMs
    )
  );

  return Promise.race([uploadPromise, timeoutPromise]);
}
