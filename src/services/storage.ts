import { INITIAL_DEMO_INCIDENTS } from '../data/demoIncidents';
import { CivicIncident, IncidentStatus } from '../types';

const DB_NAME = 'nagar_eye_db';
const DB_VERSION = 1;
const STORE_NAME = 'incidents';
const LOCAL_STORAGE_FALLBACK_KEY = 'nagar_eye_incidents_v1';

class StorageService {
  private dbPromise: Promise<IDBDatabase | null>;

  constructor() {
    this.dbPromise = this.initIndexedDB();
  }

  private initIndexedDB(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          console.warn('IndexedDB unavailable, falling back to localStorage');
          resolve(null);
        };
      } catch (err) {
        console.warn('Failed to initialize IndexedDB:', err);
        resolve(null);
      }
    });
  }

  async getAllIncidents(): Promise<CivicIncident[]> {
    const db = await this.dbPromise;

    if (db) {
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const request = store.getAll();

          request.onsuccess = () => {
            const list = request.result as CivicIncident[];
            if (!list || list.length === 0) {
              // Seed initial demo data
              this.seedDemoData().then((seeded) => resolve(seeded));
            } else {
              resolve(list);
            }
          };

          request.onerror = () => {
            resolve(this.getFallbackStorage());
          };
        } catch {
          resolve(this.getFallbackStorage());
        }
      });
    }

    return this.getFallbackStorage();
  }

  private getFallbackStorage(): CivicIncident[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_FALLBACK_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
      localStorage.setItem(LOCAL_STORAGE_FALLBACK_KEY, JSON.stringify(INITIAL_DEMO_INCIDENTS));
      return INITIAL_DEMO_INCIDENTS;
    } catch {
      return INITIAL_DEMO_INCIDENTS;
    }
  }

  async saveIncident(incident: CivicIncident): Promise<void> {
    const db = await this.dbPromise;

    if (db) {
      return new Promise((resolve, reject) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          store.put(incident);

          tx.oncomplete = () => {
            this.syncToFallback(incident);
            resolve();
          };
          tx.onerror = () => reject(tx.error);
        } catch (err) {
          this.syncToFallback(incident);
          resolve();
        }
      });
    }

    this.syncToFallback(incident);
  }

  async updateIncidentStatus(
    id: string,
    status: IncidentStatus,
    note?: string,
    resolutionEvidence?: CivicIncident['resolutionEvidence']
  ): Promise<CivicIncident | null> {
    const incidents = await this.getAllIncidents();
    const targetIndex = incidents.findIndex((i) => i.id === id);

    if (targetIndex === -1) return null;

    const incident = { ...incidents[targetIndex] };
    incident.status = status;
    incident.timeline = [
      ...incident.timeline,
      {
        status,
        timestamp: new Date().toISOString(),
        note: note || `Status progressed to ${status}`,
      },
    ];

    if (resolutionEvidence) {
      incident.resolutionEvidence = resolutionEvidence;
      incident.afterImageUrl = resolutionEvidence.afterImageUrl;
    }

    await this.saveIncident(incident);
    return incident;
  }

  private syncToFallback(incident: CivicIncident) {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_FALLBACK_KEY);
      const list: CivicIncident[] = raw ? JSON.parse(raw) : [...INITIAL_DEMO_INCIDENTS];
      const index = list.findIndex((i) => i.id === incident.id);
      if (index >= 0) {
        list[index] = incident;
      } else {
        list.unshift(incident);
      }
      localStorage.setItem(LOCAL_STORAGE_FALLBACK_KEY, JSON.stringify(list));
    } catch (err) {
      console.warn('localStorage sync warning:', err);
    }
  }

  async seedDemoData(): Promise<CivicIncident[]> {
    const db = await this.dbPromise;
    if (db) {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        for (const item of INITIAL_DEMO_INCIDENTS) {
          store.put(item);
        }
      } catch (err) {
        console.warn('Seeding IndexedDB error:', err);
      }
    }
    try {
      localStorage.setItem(LOCAL_STORAGE_FALLBACK_KEY, JSON.stringify(INITIAL_DEMO_INCIDENTS));
    } catch {}
    return INITIAL_DEMO_INCIDENTS;
  }

  async resetToDemoDefaults(): Promise<CivicIncident[]> {
    const db = await this.dbPromise;
    if (db) {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.clear();
      } catch {}
    }
    return this.seedDemoData();
  }
}

export const storageService = new StorageService();
