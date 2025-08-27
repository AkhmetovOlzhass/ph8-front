"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye } from "lucide-react"
import { contentAPI, type Task, type Topic } from "@/lib/api"

export function TasksSection() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [bodyMd, setBodyMd] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [selectedTopicId, setSelectedTopicId] = useState("")
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [tasksData, topicsData] = await Promise.all([contentAPI.getDraftTasks(), contentAPI.getAllTopics()])
      setTasks(tasksData)
      setTopics(topicsData)
    } catch (error) {
      setError("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setError("")
    try {
      await contentAPI.createTask({
        title,
        bodyMd,
        difficulty: difficulty as "EASY" | "MEDIUM" | "HARD" | "EXTREME",
        topicId: selectedTopicId,
      })
      setTitle("")
      setBodyMd("")
      setDifficulty("")
      setSelectedTopicId("")
      setIsCreateOpen(false)
      loadData()
    } catch (error) {
      setError("Failed to create task")
    } finally {
      setCreating(false)
    }
  }

  const handlePublishTask = async (taskId: string) => {
    try {
      await contentAPI.publishTask(taskId)
      loadData()
    } catch (error) {
      setError("Failed to publish task")
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-300">Loading tasks...</div>
  }

  return (
    <div className="p-6 bg-gray-950 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Tasks</h1>
          <p className="text-gray-400">Manage physics learning tasks</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4">
              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-2 rounded-md text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="task-title" className="text-gray-300">
                  Title
                </Label>
                <Input
                  id="task-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                  required
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description" className="text-gray-300">
                  Description (Markdown)
                </Label>
                <Textarea
                  id="task-description"
                  value={bodyMd}
                  onChange={(e) => setBodyMd(e.target.value)}
                  placeholder="Enter task description in Markdown format"
                  required
                  className="min-h-32 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-gray-300">
                  Topic
                </Label>
                <Select value={selectedTopicId} onValueChange={setSelectedTopicId} required>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {topics.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id} className="text-white hover:bg-gray-700">
                        {topic.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-gray-300">
                  Difficulty
                </Label>
                <Select value={difficulty} onValueChange={setDifficulty} required>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select difficulty level" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="EASY" className="text-green-400 hover:bg-gray-700">
                      Easy
                    </SelectItem>
                    <SelectItem value="MEDIUM" className="text-yellow-400 hover:bg-gray-700">
                      Medium
                    </SelectItem>
                    <SelectItem value="HARD" className="text-red-400 hover:bg-gray-700">
                      Hard
                    </SelectItem>
                    <SelectItem value="EXTREME" className="text-purple-400 hover:bg-gray-700">
                      Extreme
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={creating} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                {creating ? "Creating..." : "Create Task"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tasks.map((task) => (
          <Card key={task.id} className="bg-gray-900 border-gray-700 hover:bg-gray-800 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-white">{task.title}</CardTitle>
                  <CardDescription className="text-gray-400">{task.description}</CardDescription>
                </div>
                <Badge
                  variant={task.status === "PUBLISHED" ? "default" : "secondary"}
                  className={task.status === "PUBLISHED" ? "bg-green-600 text-white" : "bg-gray-600 text-gray-300"}
                >
                  {task.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">
                  Topic: {topics.find((t) => t.id === task.topicId)?.title || "Unknown"}
                </p>
                <p className="text-sm text-gray-400">Created: {new Date(task.createdAt).toLocaleDateString()}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  {task.status === "DRAFT" && (
                    <Button
                      size="sm"
                      onClick={() => handlePublishTask(task.id)}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      Publish
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No tasks created yet. Create your first task to get started.</p>
        </div>
      )}
    </div>
  )
}
