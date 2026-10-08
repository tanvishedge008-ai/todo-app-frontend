"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Loader2 } from "lucide-react"

interface Todo {
  id: number
  text: string
  completed: boolean
}

const API_BASE_URL = "http://localhost:8080/api"

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const fetchTodos = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/todos`)
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error("Failed to fetch todos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const addTodo = async () => {
    if (inputValue.trim() !== "") {
      try {
        const response = await fetch(`${API_BASE_URL}/todos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: inputValue.trim() }),
        })
        if (response.ok) {
          setInputValue("")
          await fetchTodos()
        }
      } catch (error) {
        console.error("Failed to add todo:", error)
      }
    }
  }

  const toggleTodo = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: "PUT",
      })
      if (response.ok) await fetchTodos()
    } catch (error) {
      console.error("Failed to toggle todo:", error)
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: "DELETE",
      })
      if (response.ok) await fetchTodos()
    } catch (error) {
      console.error("Failed to delete todo:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addTodo()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Simple Todo List
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add a new todo..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={addTodo} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : todos.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No todos yet. Add one above!
                </p>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="h-4 w-4 rounded border-border"
                    />
                    <span
                      className={`flex-1 ${
                        todo.completed
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {todo.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTodo(todo.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            {!isLoading && todos.length > 0 && (
              <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                Total: {todos.length} | Completed:{" "}
                {todos.filter((t) => t.completed).length} | Remaining:{" "}
                {todos.filter((t) => !t.completed).length}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}