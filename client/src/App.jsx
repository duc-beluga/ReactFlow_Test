import React, { useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";

import CustomNode from "./customNode";
import { FlowProvider } from "./FlowProvider";
import coursesArray from "./data.json";
import "reactflow/dist/style.css";

const initialNodes = [
  { name: "CS 1331", postCoursesList: ["CS 1332", "CS 2340", "CS 2110"] },
];

const coursesObj = coursesArray.reduce((acc, course) => {
  acc[course.name] = course.postCoursesList;
  return acc;
}, {});

const formatNodes = (nodes) => {
  let posX = 50;
  let posY = 50;
  const gapX = 50;
  const gapY = 50;
  let idNum = 1;
  let updatedNodes = [];
  for (let i = 0; i < nodes.length; i++) {
    let newCourse = {
      id: `${idNum}`,
      type: "customNode",
      position: { x: posX, y: posY },
      data: {
        course: nodes[i].name,
        postCourses: nodes[i].postCoursesList,
      },
    };
    idNum += 1;
    posX += gapX;
    posY += gapY;
    updatedNodes.push(newCourse);
  }
  return updatedNodes;
};

const formatEdges = (edges) => {
  let updatedEdges = [];
  for (let i = 0; i < edges.length; i++) {
    let newEdge = {
      id: `${edges[i][0]}-${edges[i][1]}`,
      source: `${edges[i][0]}`,
      target: `${edges[i][1]}`,
    };
    updatedEdges.push(newEdge);
  }
  return updatedEdges;
};

const nodeTypes = { customNode: CustomNode };

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    formatNodes(initialNodes)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(formatEdges([]));

  const addNode = useCallback((nodeId, courseName) => {
    const newNodeId = `${nodes.length + 1}`;
    const pcList = coursesObj[courseName] ? coursesObj[courseName] : [];
    const newNode = {
      id: newNodeId,
      type: "customNode",
      position: {
        x: Math.random() * (window.innerWidth - 15),
        y: Math.random() * (window.innerHeight - 15),
      },
      data: { course: courseName, postCourses: pcList },
    };

    setNodes((nodes) => {
      return [...nodes, newNode];
    });

    setEdges((edges) => {
      return [
        ...edges,
        { id: `${nodeId}-${newNodeId}`, source: nodeId, target: newNodeId },
      ];
    });
  });

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <FlowProvider addNode={addNode}>
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </FlowProvider>
  );
}
