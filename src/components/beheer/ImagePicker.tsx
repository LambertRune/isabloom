"use client";

import { useState } from "react";

type DirectusFile = {
  id: string;
  title?: string | null;
};

export function ImagePicker({
  value,
  onChange,
  label = "Afbeelding",
}: {
  value: string | null;
  onChange: (fileId: string | null) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryFiles, setLibraryFiles] = useState<DirectusFile[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadLibrary() {
    setLoadingLibrary(true);
    setError(null);
    try {
      const response = await fetch("/api/beheer/files");
      const data = (await response.json()) as DirectusFile[] | { error?: string };
      if (!response.ok) {
        throw new Error(
          !Array.isArray(data) && data.error ? data.error : "Bibliotheek laden mislukt.",
        );
      }
      setLibraryFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bibliotheek laden mislukt.");
      setLibraryFiles([]);
    } finally {
      setLoadingLibrary(false);
    }
  }

  async function openLibrary() {
    setLibraryOpen(true);
    await loadLibrary();
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/beheer/files", { method: "POST", body });
      const data = (await response.json()) as { id?: string; error?: string };
      if (!response.ok || !data.id) {
        throw new Error(data.error || "Upload mislukt.");
      }
      onChange(data.id);
      setLibraryOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload mislukt.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="beheer-field">
      <span>{label}</span>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/media/${value}`} alt="" className="beheer-preview" />
      ) : (
        <p className="beheer-muted">Nog geen afbeelding. Upload er een via dit paneel.</p>
      )}
      <div className="beheer-actions">
        <label className="beheer-btn-ghost" style={{ cursor: "pointer" }}>
          Nieuwe upload
          <input
            type="file"
            accept="image/*"
            hidden
            disabled={uploading}
            onChange={handleFile}
          />
        </label>
        <button
          type="button"
          className="beheer-btn-ghost"
          disabled={uploading}
          onClick={() => void openLibrary()}
        >
          Kies uit bibliotheek
        </button>
        {value ? (
          <button type="button" className="beheer-btn-ghost" onClick={() => onChange(null)}>
            Verwijderen
          </button>
        ) : null}
      </div>
      {uploading ? <p className="beheer-muted">Uploaden…</p> : null}
      {error ? <p className="beheer-error">{error}</p> : null}
      {libraryOpen ? (
        <div
          className="beheer-library"
          role="dialog"
          aria-modal="true"
          aria-label="Afbeeldingenbibliotheek"
          onClick={() => setLibraryOpen(false)}
        >
          <div className="beheer-library-panel" onClick={(event) => event.stopPropagation()}>
            <div className="beheer-actions" style={{ justifyContent: "space-between" }}>
              <h3>Kies een afbeelding</h3>
              <button type="button" className="beheer-btn-ghost" onClick={() => setLibraryOpen(false)}>
                Sluiten
              </button>
            </div>
            {loadingLibrary ? (
              <p className="beheer-muted">Laden…</p>
            ) : libraryFiles.length === 0 ? (
              <p className="beheer-muted">Nog geen afbeeldingen. Upload eerst een bestand.</p>
            ) : (
              <div className="beheer-library-grid">
                {libraryFiles.map((file) => (
                  <button
                    key={file.id}
                    type="button"
                    className="beheer-library-item"
                    onClick={() => {
                      onChange(file.id);
                      setLibraryOpen(false);
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/media/${file.id}`} alt={file.title || ""} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
