"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Task, Topic } from "@/lib/api"
import { Play, BookOpen, Clock, Target, Zap, Flame } from "lucide-react"

interface TaskCardProps {
  task: Task
  topic?: Topic
  onViewTask: (taskId: string) => void
}

export function TaskCard({ task, topic, onViewTask }: TaskCardProps) {
  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return {
          color: "text-emerald-400",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/20",
          icon: <Target className="h-3 w-3" />,
          glow: "hover:shadow-emerald-500/20",
        }
      case "MEDIUM":
        return {
          color: "text-amber-400",
          bg: "bg-amber-500/10",
          border: "border-amber-500/20",
          icon: <Clock className="h-3 w-3" />,
          glow: "hover:shadow-amber-500/20",
        }
      case "HARD":
        return {
          color: "text-red-400",
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          icon: <Zap className="h-3 w-3" />,
          glow: "hover:shadow-red-500/20",
        }
      case "EXTREME":
        return {
          color: "text-purple-400",
          bg: "bg-purple-500/10",
          border: "border-purple-500/20",
          icon: <Flame className="h-3 w-3" />,
          glow: "hover:shadow-purple-500/20",
        }
      default:
        return {
          color: "text-slate-400",
          bg: "bg-slate-500/10",
          border: "border-slate-500/20",
          icon: <Target className="h-3 w-3" />,
          glow: "hover:shadow-slate-500/20",
        }
    }
  }

  const difficultyConfig = getDifficultyConfig(task.difficulty)

  return (
    <Card className="group relative overflow-hidden bg-slate-900/80 backdrop-blur-sm border-slate-700/50 hover:border-orange-500/30 transition-all duration-500 hover:scale-[1.02] cursor-pointer">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Animated border glow */}
      <div
        className={`absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm ${difficultyConfig.glow}`}
      />

      <div className="relative">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <CardTitle className="text-white text-lg font-semibold group-hover:text-orange-400 transition-colors duration-300 line-clamp-2 text-balance">
                {task.title}
              </CardTitle>
              <CardDescription className="text-slate-400 text-sm line-clamp-2 text-balance leading-relaxed">
                {task.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge
              className={`${difficultyConfig.bg} ${difficultyConfig.color} ${difficultyConfig.border} flex items-center gap-1.5 px-2.5 py-1 font-medium transition-all duration-300 group-hover:scale-105`}
            >
              {difficultyConfig.icon}
              {task.difficulty}
            </Badge>
            {topic && (
              <span className="text-xs text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/50 transition-colors duration-300 group-hover:text-slate-300 group-hover:bg-slate-800/80">
                <BookOpen className="inline h-3 w-3 mr-1" />
                {topic.title}
              </span>
            )}
          </div>

          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {task.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={tag}
                  className="text-xs bg-slate-800/60 text-slate-400 px-2 py-1 rounded border border-slate-700/30 transition-all duration-300 hover:bg-slate-700/60 hover:text-slate-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  #{tag}
                </span>
              ))}
              {task.tags.length > 3 && (
                <span className="text-xs text-slate-500 px-2 py-1">+{task.tags.length - 3} more</span>
              )}
            </div>
          )}

          <Button
            className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-medium transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange-500/25 group-hover:scale-[1.02] border-0"
            onClick={() => onViewTask(task.id)}
          >
            <Play className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
            Solve Challenge
          </Button>
        </CardContent>
      </div>
    </Card>
  )
}
