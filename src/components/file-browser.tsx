// ============================================
// File Browser Component (React, client-side)
// ============================================

import { useState, useEffect } from 'react';
import { formatFileSize, formatDate } from '@/lib/utils';

interface NasFile {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  modifiedAt: string | null;
}

interface Props {
  initialPath?: string;
}

export default function FileBrowser({ initialPath }: Props) {
  const [files, setFiles] = useState<NasFile[]>([]);
  const [currentPath, setCurrentPath] = useState(initialPath || '');
  const [basePath, setBasePath] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function browse(path: string) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/proxy/files/browse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Chyba pri načítaní súborov');
        return;
      }

      setFiles(data.files || []);
      setCurrentPath(data.currentPath || path);
      if (!basePath) setBasePath(data.clientBasePath || '');
    } catch {
      setError('Chyba pripojenia');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    browse(initialPath || '');
  }, [initialPath]);

  const canGoUp = currentPath && currentPath !== basePath;

  function goUp() {
    const parts = currentPath.split('/');
    parts.pop();
    const parent = parts.join('/');
    if (parent.startsWith(basePath)) {
      browse(parent);
    }
  }

  // Breadcrumb parts
  const breadcrumbParts = currentPath
    .replace(basePath, '')
    .split('/')
    .filter(Boolean);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm mb-4 flex-wrap">
        <button
          onClick={() => browse(basePath)}
          className="text-adsun-orange hover:underline"
        >
          Moje súbory
        </button>
        {breadcrumbParts.map((part, i) => {
          const fullPath = basePath + '/' + breadcrumbParts.slice(0, i + 1).join('/');
          return (
            <span key={i} className="flex items-center gap-1">
              <span className="text-adsun-muted">›</span>
              <button
                onClick={() => browse(fullPath)}
                className={`${i === breadcrumbParts.length - 1 ? 'text-white' : 'text-adsun-muted hover:text-adsun-orange'}`}
              >
                {decodeURIComponent(part)}
              </button>
            </span>
          );
        })}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4 mb-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="skeleton h-12 w-full rounded" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="text-center text-adsun-muted py-12">
          <p>Tento priečinok je prázdny.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {/* Go up */}
          {canGoUp && (
            <button
              onClick={goUp}
              className="w-full flex items-center gap-3 p-3 rounded hover:bg-white/5 transition-colors text-left"
            >
              <svg className="w-5 h-5 text-adsun-muted" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              <span className="text-adsun-muted text-sm">..</span>
            </button>
          )}

          {/* Directories first, then files */}
          {files
            .sort((a, b) => (a.isDirectory === b.isDirectory ? a.name.localeCompare(b.name) : a.isDirectory ? -1 : 1))
            .map(file => (
              <div
                key={file.path}
                className="w-full flex items-center gap-3 p-3 rounded hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => file.isDirectory ? browse(file.path) : undefined}
              >
                {file.isDirectory ? (
                  <svg className="w-5 h-5 text-adsun-orange flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-adsun-muted flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{file.name}</p>
                </div>
                {!file.isDirectory && (
                  <>
                    <span className="text-adsun-muted text-xs hidden md:block">{formatFileSize(file.size)}</span>
                    <a
                      href={`/api/proxy/files/download?path=${encodeURIComponent(file.path)}`}
                      onClick={e => e.stopPropagation()}
                      className="text-adsun-orange hover:underline text-xs flex-shrink-0"
                    >
                      Stiahnuť
                    </a>
                  </>
                )}
                {file.modifiedAt && (
                  <span className="text-adsun-muted text-xs hidden lg:block">{formatDate(file.modifiedAt)}</span>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
