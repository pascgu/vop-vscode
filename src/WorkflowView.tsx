import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactFlow, { Background, Controls, useNodesState, useEdgesState, OnNodesChange, OnEdgesChange } from 'reactflow';

console.log("LOG[Webview]: WorkflowView module loaded and starting execution.");

interface Node {
  id: string;
  position: { x: number; y: number };
  data: { label: string };
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

const WorkflowView = () => {
  console.log("LOG[Webview]: Nodes:", window.nodes);
  console.log("LOG[Webview]: Edges:", window.edges);
  const [nodes, setNodes, onNodesChange] = useNodesState(window.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(window.edges || []);
  
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow 
        nodes={nodes} 
        edges={edges}
        onNodesChange={onNodesChange as OnNodesChange} 
        onEdgesChange={onEdgesChange as OnEdgesChange}
        fitView // Center the diagram
        >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    console.log("LOG[Webview]: Attempting ReactDOM.createRoot..."); 
    const root = ReactDOM.createRoot(rootElement);
    
    console.log("LOG[Webview]: Rendering <WorkflowView />..."); 
    root.render(<WorkflowView />);
    
    console.log("LOG[Webview]: ReactDOM render process finished.");
  } catch (e) {
    console.error("LOG[Webview] CRITICAL ERROR: Failed to mount React application.", e);
    rootElement.innerHTML = `<h1>Error rendering React. See console for details.</h1>`;
  }
} else {
    console.error("LOG[Webview]: Error: #root element not found."); 
}
