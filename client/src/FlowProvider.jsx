import React, { createContext, useContext } from "react";

// Create a context
const FlowContext = createContext();

// Context provider component
export const FlowProvider = ({ children, createPostCourse }) => {
  return (
    <FlowContext.Provider value={{ createPostCourse }}>
      {children}
    </FlowContext.Provider>
  );
};

// Hook to use the context
export const useFlow = () => useContext(FlowContext);
