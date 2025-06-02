import OpenAI from 'openai';
import { Task } from '../types/task';
import dotenv from 'dotenv';

dotenv.config();

let openai: OpenAI | null = null;

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  } else {
    console.warn('Warning: OPENAI_API_KEY is not set. AI features will be disabled.');
  }
} catch (error) {
  console.warn('Error initializing OpenAI client:', error);
}

export const summarizeTasks = async (tasks: Task[]): Promise<string> => {
  if (!openai) {
    return 'AI summarization is disabled. Please configure OPENAI_API_KEY to enable this feature.';
  }

  try {
    const tasksText = tasks
      .map(task => `- ${task.title}: ${task.description}`)
      .join('\n');

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a task summarizer. Given a list of related tasks, create a concise summary that captures their overall objective."
        },
        {
          role: "user",
          content: `Summarize these related tasks:\n${tasksText}`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return response.choices[0].message.content || 'No summary generated';
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return 'Failed to generate summary. Please try again later.';
  }
};

export const decomposeTasks = async (task: Task): Promise<Task[]> => {
  if (!openai) {
    // Return a simple decomposition when AI is not available
    return [
      {
        id: crypto.randomUUID(),
        title: `${task.title} - Part 1`,
        description: 'AI decomposition is disabled. This is a placeholder subtask.',
        status: 'TODO',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId: task.id
      },
      {
        id: crypto.randomUUID(),
        title: `${task.title} - Part 2`,
        description: 'AI decomposition is disabled. This is a placeholder subtask.',
        status: 'TODO',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId: task.id
      }
    ];
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a task decomposition expert. Break down the given task into smaller, manageable subtasks."
        },
        {
          role: "user",
          content: `Break down this task into 3-5 subtasks:\nTitle: ${task.title}\nDescription: ${task.description}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) return [];
    
    try {
      const parsed = JSON.parse(content);
      return parsed.subtasks.map((subtask: any) => ({
        id: crypto.randomUUID(),
        title: subtask.title,
        description: subtask.description,
        status: 'TODO',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId: task.id
      }));
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      return [];
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return [];
  }
}; 