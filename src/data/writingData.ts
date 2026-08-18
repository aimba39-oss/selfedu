export type WritingTaskType = "task-1" | "task-2";

export interface WritingTask {
  id: string;
  type: WritingTaskType;
  title: string;
  minutes: number;
  wordTarget: number;
  prompt: string;
  notes: string[];
}

export const writingTasks: WritingTask[] = [
  {
    id: "task-1-1",
    type: "task-1",
    title: "Academic Task 1",
    minutes: 20,
    wordTarget: 150,
    prompt:
      "The table below shows the percentage of university students who used four different methods of transportation to travel to campus in 2010 and 2025.",
    notes: [
      "Summarise the information by selecting and reporting the main features.",
      "Make comparisons where relevant.",
    ],
  },
  {
    id: "task-2-1",
    type: "task-2",
    title: "Academic Task 2",
    minutes: 40,
    wordTarget: 250,
    prompt:
      "Some people believe that schools should focus mainly on academic subjects, while others believe that practical skills are equally important. Discuss both views and give your own opinion.",
    notes: [
      "Give reasons for your answer.",
      "Include relevant examples from your own knowledge or experience.",
    ],
  },
];

export function getWritingTask(taskId: string) {
  return writingTasks.find((task) => task.id === taskId);
}