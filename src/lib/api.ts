import { API_BASE_URL } from "./auth"

export interface Topic {
  id: string
  title: string
  slug: string
  description: string
  parentId?: string
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  content: string
  bodyMd: string
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXTREME"
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  tags: string[]
  topicId: string
  authorId: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name: string
  role: "ADMIN" | "USER"
  createdAt: string
}

export interface Solution {
  id: string
  bodyMd: string
  taskId: string
  userId: string
  createdAt: string
  updatedAt: string
}

function getAuthHeaders() {
  const token = localStorage.getItem("access_token")
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export const contentAPI = {
  // Topics
  async createTopic(data: { title: string; slug: string }) {
    const response = await fetch(`${API_BASE_URL}/api/v1/content/topics`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create topic")
    return response.json()
  },

  async getAllTopics(): Promise<Topic[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/content/topics`)
    if (!response.ok) throw new Error("Failed to fetch topics")
      
    return response.json()
  },

  async getTopicById(id: string): Promise<Topic> {
    const response = await fetch(`${API_BASE_URL}/api/v1/content/topics/${id}`)
    if (!response.ok) throw new Error("Failed to fetch topic")
    return response.json()
  },

  // Tasks
  async createTask(data: { title: string; bodyMd: string; difficulty: string; topicId: string }) {
    const response = await fetch(`${API_BASE_URL}/api/v1/content/tasks`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create task")
    return response.json()
  },

  async publishTask(taskId: string) {
    const response = await fetch(`${API_BASE_URL}/api/v1/content/tasks/publish`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ taskId }),
    })
    if (!response.ok) throw new Error("Failed to publish task")
    return response.json()
  },

  async getDraftTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/content/tasks/drafts`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch draft tasks")
    return response.json()
  },

  async getTask(id: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/v1/content/tasks/${id}`)
    if (!response.ok) throw new Error("Failed to fetch task")
    return response.json()
  },

  async getTasksByTopic(topicId: string): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/content/topics/${topicId}/tasks`)
    if (!response.ok) throw new Error("Failed to fetch tasks")
    return response.json()
  },
}

export const usersAPI = {
  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/users`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) throw new Error("Failed to fetch users")
    return response.json()
  },
}
