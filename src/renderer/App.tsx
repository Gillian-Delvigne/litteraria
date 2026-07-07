import "./App.css";
import React, { useState } from "react";
import WorkspacePicker from "./screens/WorkspacePicker";
import MainWorkspace from "./screens/MainWorkspace";

function App() {
    const [workspacePath, setWorkspacePath] = useState<string | null>(null);

    if (!workspacePath) {
        return <WorkspacePicker onWorkspaceSelected={setWorkspacePath} />;
    }
    return <MainWorkspace workspacePath={workspacePath} />;
}

export default App;
