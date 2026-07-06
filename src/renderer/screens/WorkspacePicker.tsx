import React from 'react';

interface Props {
  onWorkspaceSelected: (path: string) => void;
}

export default function WorkspacePicker({ onWorkspaceSelected }: Props) {
  const handlePickWorkspace = async () => {
    const path = await window.electronAPI.workspace.pick();
    if (path) {
      onWorkspaceSelected(path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-paper to-[#f2ebe0] flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <h1 className="font-display text-6xl font-semibold text-ink mb-4">
          LitterarIA
        </h1>
        <p className="font-ui text-xl text-warm-gray mb-12">
          Ton mentor d'écriture personnel, propulsé par l'IA
        </p>

        <div className="bg-white rounded-2xl p-12 shadow-xl">
          <div className="text-6xl mb-6">📁</div>
          <h2 className="font-display text-3xl font-semibold text-ink mb-4">
            Choisis ton espace de travail
          </h2>
          <p className="text-warm-gray mb-8">
            Sélectionne le dossier où se trouvent tes fichiers d'écriture.
          </p>

          <button
            onClick={handlePickWorkspace}
            className="bg-accent-sage hover:bg-accent-sage/90 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-lg"
          >
            Parcourir...
          </button>
        </div>
      </div>
    </div>
  );
}