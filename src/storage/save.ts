/**
 * Persistence for logic-tree progress.
 *
 * Backend is localStorage for the web prototype. The SaveStore interface
 * lets the desktop build swap in a file / native store later without
 * touching callers.
 */

export type ProblemSave = {
  /** Final score on first submit (immutable thereafter). */
  score: number
  /** Target axis id the player was judged against; null if none. */
  targetAxisId: string | null
  /** Device-local calendar date of submit, YYYY-MM-DD. */
  solvedDate: string
}

export type SaveData = {
  version: 1
  /** Keyed by problem id. */
  problems: Record<string, ProblemSave>
}

export const EMPTY_SAVE: SaveData = {
  version: 1,
  problems: {},
}

const STORAGE_KEY = 'logic-tree-save-v1'

export type SaveStore = {
  load(): SaveData
  save(data: SaveData): void
  clear(): void
}

function isProblemSave(value: unknown): value is ProblemSave {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.score === 'number' &&
    (typeof v.targetAxisId === 'string' || v.targetAxisId === null) &&
    typeof v.solvedDate === 'string'
  )
}

function normalize(raw: unknown): SaveData {
  if (typeof raw !== 'object' || raw === null) return { ...EMPTY_SAVE, problems: {} }
  const obj = raw as Record<string, unknown>
  if (obj.version !== 1 || typeof obj.problems !== 'object' || obj.problems === null) {
    return { ...EMPTY_SAVE, problems: {} }
  }
  const problems: Record<string, ProblemSave> = {}
  for (const [id, entry] of Object.entries(obj.problems as Record<string, unknown>)) {
    if (isProblemSave(entry)) problems[id] = entry
  }
  return { version: 1, problems }
}

export function createLocalStorageStore(
  key: string = STORAGE_KEY,
): SaveStore {
  return {
    load() {
      try {
        const raw = localStorage.getItem(key)
        if (!raw) return { ...EMPTY_SAVE, problems: {} }
        return normalize(JSON.parse(raw) as unknown)
      } catch {
        return { ...EMPTY_SAVE, problems: {} }
      }
    },
    save(data: SaveData) {
      try {
        localStorage.setItem(key, JSON.stringify(data))
      } catch {
        // Quota / private mode — ignore; in-memory state still works this session.
      }
    },
    clear() {
      try {
        localStorage.removeItem(key)
      } catch {
        // ignore
      }
    },
  }
}

/** Default store used by the app. Swap this for a desktop backend later. */
export const saveStore: SaveStore = createLocalStorageStore()

/** Device-local date as YYYY-MM-DD. */
export function todayLocalDate(now: Date = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function recordProblemResult(
  data: SaveData,
  problemId: string,
  score: number,
  targetAxisId: string | null,
  solvedDate: string = todayLocalDate(),
): SaveData {
  // Score is final on first submit — do not overwrite an existing entry.
  if (data.problems[problemId]) return data
  return {
    ...data,
    problems: {
      ...data.problems,
      [problemId]: { score, targetAxisId, solvedDate },
    },
  }
}
