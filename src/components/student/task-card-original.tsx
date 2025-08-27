"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Task, Topic } from "@/lib/api"
import { Play, BookOpen, Clock, Target } from "lucide-react"

interface TaskCardProps {
  task: Task
  topic?: Topic
  onViewTask: (taskId: string) => void
}

export function TaskCard({ task, topic, onViewTask }: TaskCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "MEDIUM":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "HARD":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "EXTREME":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return <Target className="h-3 w-3" />
      case "MEDIUM":
        return <Clock className="h-3 w-3" />
      case "HARD":
        return <BookOpen className="h-3 w-3" />
      case "EXTREME":
        return <Target className="h-3 w-3" />
      default:
        return <Target className="h-3 w-3" />
    }
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 hover:bg-slate-900/70 transition-all duration-300 group hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/10">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-lg mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
              {task.title}
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm line-clamp-2">{task.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge className={`${getDifficultyColor(task.difficulty)} flex items-center gap-1`}>
            {getDifficultyIcon(task.difficulty)}
            {task.difficulty}
          </Badge>
          {topic && <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded">{topic.title}</span>}
        </div>

        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs bg-slate-800/50 text-slate-400 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
            {task.tags.length > 3 && <span className="text-xs text-slate-500">+{task.tags.length - 3} more</span>}
          </div>
        )}

        <Button
          className="w-full bg-orange-600 hover:bg-orange-500 text-white transition-all duration-300 group-hover:shadow-md"
          onClick={() => onViewTask(task.id)}
        >
          <Play className="w-4 h-4 mr-2" />
          Start Task
        </Button>
      </CardContent>
    </Card>
  )
}
