type StoredValue<T> = T extends string ? string : T;

export const storage = {
    get<T>(key: string): StoredValue<T> | null {
        if (typeof window === "undefined") return null;
        const value = localStorage.getItem(key);
        if (value === null) return null;

        try {
            const parsed = JSON.parse(value);
            return parsed as StoredValue<T>;
        } catch {
            // If T is string, return value; otherwise return null
            if (typeof ("" as T) === "string") return value as StoredValue<T>;
            return null;
        }
    },

    set<T>(key: string, value: StoredValue<T>): void {
        if (typeof window === "undefined") return;

        // If value is string, store as-is; otherwise JSON.stringify
        const storedValue =
            typeof value === "string" ? value : JSON.stringify(value);

        localStorage.setItem(key, storedValue);
    },

    update<T>(key: string, updater: (current: StoredValue<T> | null) => StoredValue<T>): void {
        const current = this.get<T>(key);
        this.set(key, updater(current));
    },

    delete(key: string): void {
        if (typeof window === "undefined") return;
        localStorage.removeItem(key);
    },
};
