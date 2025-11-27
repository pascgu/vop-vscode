import React from 'react';
import ReactDOM from 'react-dom/client';
import ReactFlow, { Background, Controls } from 'reactflow';

const initialNodes = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: 'Node 1' } },
  { id: '2', position: { x: 300, y: 100 }, data: { label: 'Node 2' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
