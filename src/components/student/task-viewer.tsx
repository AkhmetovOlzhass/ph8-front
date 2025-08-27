"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Clock, Target, Zap, Flame, Calendar } from "lucide-react"
import { contentAPI, type Task, type Topic } from "@/lib/api"

interface TaskViewerProps {
  taskId: string
  onBack: () => void
}

export function TaskViewer({ taskId, onBack }: TaskViewerProps) {
  const [task, setTask] = useState<Task | null>(null)
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTask()
  }, [taskId])

  const loadTask = async () => {
    try {
      const taskData = await contentAPI.getTask(taskId)
      setTask(taskData)

      if (taskData?.topicId) {
        const topicData = await contentAPI.getTopicById(taskData.topicId)
        setTopic(topicData)
      }
    } catch (error) {
      console.error("Failed to load task:", error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return {
          color: "text-emerald-400",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
          icon: <Target className="h-4 w-4" />,
        }
      case "MEDIUM":
        return {
          color: "text-amber-400",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          icon: <Clock className="h-4 w-4" />,
        }
      case "HARD":
        return {
          color: "text-red-400",
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          icon: <Zap className="h-4 w-4" />,
        }
      case "EXTREME":
        return {
          color: "text-purple-400",
          bg: "bg-purple-500/10",
          border: "border-purple-500/20",
          icon: <Flame className="h-4 w-4" />,
        }
      default:
        return {
          color: "text-slate-400",
          bg: "bg-slate-500/10",
          border: "border-slate-500/20",
          icon: <Target className="h-4 w-4" />,
        }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <div className="text-lg text-slate-300">Loading challenge...</div>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-slate-400 text-lg">Challenge not found</p>
          <Button
            onClick={onBack}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Challenges
          </Button>
        </div>
      </div>
    )
  }

  const difficultyConfig = getDifficultyConfig(task.difficulty)

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-slate-300 hover:text-white hover:bg-slate-800 transition-colors duration-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Challenges
            </Button>

            <div className="flex items-center gap-3">
              <Badge
                className={`${difficultyConfig.bg} ${difficultyConfig.color} ${difficultyConfig.border} flex items-center gap-1.5 px-3 py-1.5 font-medium`}
              >
                {difficultyConfig.icon}
                {task.difficulty}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Problem Description */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
              <CardHeader className="pb-6">
                <div className="space-y-4">
                  <CardTitle className="text-3xl font-bold text-white text-balance">{task.title}</CardTitle>
                  <CardDescription className="text-lg text-slate-300 leading-relaxed text-balance">
                    {task.description}
                  </CardDescription>

                  <div className="flex items-center gap-6 text-sm text-slate-400 pt-2">
                    {topic && (
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{topic.title}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="prose prose-slate prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-slate-200 leading-relaxed text-lg">{task.content}</div>
                </div>

                {task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-700/50">
                    {task.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-sm bg-slate-800/60 text-slate-300 px-3 py-1.5 rounded-md border border-slate-700/30 hover:bg-slate-700/60 transition-colors duration-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Topic Info */}
            {topic && (
              <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-orange-400" />
                    Topic
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-white">{topic.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{topic.description}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Solution Area Placeholder */}
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-lg text-white">Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
                    <p className="text-slate-400 text-sm text-center">Solution editor would go here</p>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium transition-all duration-300">
                    Submit Solution
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
