import { render, screen } from "@testing-library/react";
import { TaskNode } from "../TaskNode";
import { NodeProps } from "reactflow";
import { Task } from "../../types/task";
import { ReactFlowProvider } from "reactflow";

describe("TaskNode", () => {
  const mockTask: Task = {
    id: "1",
    title: "Test Task",
    description: "Test Description",
    status: "TODO",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockProps = {
    data: mockTask,
  } as NodeProps<Task>;

  it("renders task title and description", () => {
    render(
      <ReactFlowProvider>
        <TaskNode {...mockProps} />
      </ReactFlowProvider>,
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("renders task status chip", () => {
    render(
      <ReactFlowProvider>
        <TaskNode {...mockProps} />
      </ReactFlowProvider>,
    );

    expect(screen.getByText("TODO")).toBeInTheDocument();
  });
});
