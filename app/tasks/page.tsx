'use client';

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { DatePickerDemo } from "@/app/components/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { getUserProfile, updateUserProfile } from "@/lib/firebase-utils";
import GoldenLoader from "@/app/components/golden-loader";

interface Task {
  id: string;
  title: string;
  dueDate: Date;
  completed: boolean;
}

export default function TasksPage() {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Load tasks data
  useEffect(() => {
    const loadTasks = async () => {
      if (!user) return;
      try {
        const data = await getUserProfile(user.uid);
        if (data && data.tasks) {
          setTasks(data.tasks);
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };

    loadTasks();
  }, [user]);

  // Save tasks data
  const saveTasks = async (newTasks: Task[]) => {
    if (!user) return;
    try {
      await updateUserProfile(user.uid, { tasks: newTasks });
      setTasks(newTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  // Add new task
  const handleAddTask = async () => {
    if (!newTask || !selectedDate) return;

    const newTaskItem: Task = {
      id: Date.now().toString(),
      title: newTask,
      dueDate: selectedDate,
      completed: false
    };

    const updatedTasks = [...tasks, newTaskItem];
    await saveTasks(updatedTasks);
    setNewTask('');
    setSelectedDate(undefined);
  };

  // Toggle task completion
  const handleToggleTask = async (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    await saveTasks(updatedTasks);
  };

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    await saveTasks(updatedTasks);
  };

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading || !user) {
    return <GoldenLoader size="lg" />;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-2xl mx-auto">
        {/* Tasks Overview Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tasks Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-8">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="10"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-primary stroke-current"
                    strokeWidth="10"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    strokeDasharray={`${completionPercentage * 2.51} 251.2`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{completionPercentage}%</span>
                  <span className="text-sm text-muted-foreground">Completed</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
                <p className="text-xl font-bold text-primary">{pendingTasks}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed Tasks</p>
                <p className="text-xl font-bold text-green-600">{completedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add New Task Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Input
                placeholder="Task title"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-1"
              />
              <DatePickerDemo
                date={selectedDate}
                onDateChange={setSelectedDate}
              />
              <Button onClick={handleAddTask}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.filter(task => !task.completed).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleTask(task.id)}
                    />
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Due {task.dueDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.filter(task => task.completed).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-muted rounded-lg opacity-60">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleTask(task.id)}
                    />
                    <div>
                      <p className="font-medium line-through">{task.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Completed on {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 