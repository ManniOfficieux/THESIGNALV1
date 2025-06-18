import * as FileSystem from 'expo-file-system';

const CACHE_DIR = FileSystem.documentDirectory + 'puzzleCache';
const PUZZLES_FILE = `${CACHE_DIR}/puzzles.json`;

async function ensureDir() {
  const dirInfo = await FileSystem.getInfoAsync(CACHE_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
  }
}

export async function loadCachedPuzzles(): Promise<Record<string, any>> {
  try {
    await ensureDir();
    const info = await FileSystem.getInfoAsync(PUZZLES_FILE);
    if (!info.exists) return {};
    const content = await FileSystem.readAsStringAsync(PUZZLES_FILE);
    return JSON.parse(content);
  } catch {
    return {};
  }
}

export async function savePuzzle(id: string, data: any) {
  const puzzles = await loadCachedPuzzles();
  puzzles[id] = data;
  try {
    await ensureDir();
    await FileSystem.writeAsStringAsync(PUZZLES_FILE, JSON.stringify(puzzles));
  } catch {
    // ignore write errors
  }
}
