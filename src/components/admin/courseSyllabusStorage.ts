interface StoredSyllabus {
  courseKey: string;
  fileName: string;
  file: Blob;
}

interface SyllabusMetadata {
  courseKey: string;
  fileName: string;
}

let databasePromise: Promise<IDBDatabase> | undefined;

function openDatabase() {
  if (!databasePromise) {
    databasePromise = new Promise<IDBDatabase>((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new Error('Syllabus storage is not available in this browser.'));
        return;
      }

      const request = indexedDB.open('kia-course-syllabi', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('syllabi', { keyPath: 'courseKey' });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error('Could not open syllabus storage.'));
    }).catch(error => {
      databasePromise = undefined;
      throw error;
    });
  }

  return databasePromise;
}

export async function saveCourseSyllabus(courseKey: string, file: File) {
  const database = await openDatabase();

  return new Promise<void>((resolve, reject) => {
    const transaction = database.transaction('syllabi', 'readwrite');
    transaction.objectStore('syllabi').put({ courseKey, fileName: file.name, file } satisfies StoredSyllabus);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not save the syllabus.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Syllabus upload was interrupted.'));
  });
}

export async function getCourseSyllabus(courseKey: string) {
  const database = await openDatabase();

  return new Promise<StoredSyllabus | null>((resolve, reject) => {
    const request = database.transaction('syllabi', 'readonly').objectStore('syllabi').get(courseKey);
    request.onsuccess = () => resolve((request.result as StoredSyllabus | undefined) ?? null);
    request.onerror = () => reject(request.error ?? new Error('Could not load the syllabus.'));
  });
}

export async function listCourseSyllabi() {
  const database = await openDatabase();

  return new Promise<SyllabusMetadata[]>((resolve, reject) => {
    const request = database.transaction('syllabi', 'readonly').objectStore('syllabi').getAll();
    request.onsuccess = () => resolve((request.result as StoredSyllabus[]).map(({ courseKey, fileName }) => ({ courseKey, fileName })));
    request.onerror = () => reject(request.error ?? new Error('Could not load saved syllabus files.'));
  });
}
