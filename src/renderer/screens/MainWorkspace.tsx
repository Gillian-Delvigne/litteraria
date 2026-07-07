import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import type { FileItem } from '../types/electron';

interface Props {
  workspacePath: string;
}

export default function MainWorkspace({ workspacePath }: Props) {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  return (
    <div className="flex h-screen">
      <Sidebar
        workspacePath={workspacePath}
        selectedFile={selectedFile}
        onFileSelect={setSelectedFile}
      />

      <div className="flex-1 bg-paper p-8 overflow-y-auto">
        {selectedFile ? (
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink mb-2">
              {selectedFile.name}
            </h1>
            <p className="font-ui text-warm-gray text-sm mb-8">{selectedFile.path}</p>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="font-ui text-warm-gray">L'éditeur sera ici (Jour 5)</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-warm-gray">
              <div className="text-6xl mb-4">📝</div>
              <p className="font-ui text-xl">Sélectionne un fichier pour commencer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
