import { copy, ensureDir, readdir, readFile, remove, rename, writeFile } from 'fs-extra';
import glob = require('glob');
import { dirname, resolve } from 'path';
import { bindNodeCallback, Observable, of } from 'rxjs';
import { concatMap, filter, map, take } from 'rxjs/operators';

import { FileSystemService } from './models/file-system-service';

export class FileSystemServiceImp implements FileSystemService {
  getFilesAtFolder(path: string): Observable<string[]> {
    return of(path, `${path}/**`).pipe(
      concatMap((pattern) =>
        bindNodeCallback<string, glob.IOptions, string[]>(glob)(pattern, { nodir: true }),
      ),
      filter((paths) => !!paths.length),
      map((paths) => paths.map((p) => resolve(p))),
      take(1),
    );
  }

  async readFile(path: string): Promise<string> {
    return readFile(path, 'UTF-8');
  }

  async writeFile(path: string, data: string): Promise<void> {
    await writeFile(path, data);
  }

  async moveFile(srcPath: string, outPath: string): Promise<void> {
    await ensureDir(dirname(outPath));
    await rename(srcPath, outPath);
    await this.removeEmptyDir(dirname(srcPath));
  }

  async copy(src: string, dest: string): Promise<void> {
    await copy(src, dest);
  }

  private async removeEmptyDir(path: string): Promise<void> {
    const fileList = await readdir(path);
    if (!fileList.length) {
      await remove(path);
    }
  }
}
