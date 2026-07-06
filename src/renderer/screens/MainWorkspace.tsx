import React from 'react';

interface Props {
  workspacePath: string;
}

export default function MainWorkspace({ workspacePath }: Props) {
  return (
    <div className="min-h-screen bg-paper p-4">
      <div className="text-ink">
        <h1 className="font-display text-3xl font-semibold mb-4">
          Espace de travail
        </h1>
        <p className="text-warm-gray">
          📂 {workspacePath}
        </p>
      </div>
    </div>
  );
}