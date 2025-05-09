'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  dueDate: Date;
  completed: boolean;
}

interface ProfileTaskSectionProps {
  tasks: Task[];
  pendingTasks: number;
}

export default function ProfileTaskSection({ tasks, pendingTasks }: ProfileTaskSectionProps) {
  // Sort tasks by due date (closest first)
  const sortedTasks = [...tasks]
    .filter(task => !task.completed)
    .sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5); // Show only 5 upcoming tasks
    
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Upcoming Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingTasks === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
            <p className="text-muted-foreground">All tasks complete!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTasks.map(task => {
              // Format date - if due date is today or past, highlight it
              const dueDate = new Date(task.dueDate);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              
              const isPastDue = dueDate < today;
              const isToday = dueDate.toDateString() === today.toDateString();
              
              return (
                <div key={task.id} className="flex items-start gap-3 py-2">
                  <div 
                    className={`h-2 w-2 mt-2 rounded-full ${
                      isPastDue ? 'bg-red-500' : isToday ? 'bg-amber-500' : 'bg-primary'
                    }`} 
                  />
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className={`text-sm ${
                      isPastDue ? 'text-red-500 font-medium' : 
                      isToday ? 'text-amber-500 font-medium' : 
                      'text-muted-foreground'
                    }`}>
                      {isPastDue ? 'Past due: ' : isToday ? 'Due today' : 'Due: '}
                      {!isToday && new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
            
            {pendingTasks > 5 && (
              <p className="text-sm text-center text-muted-foreground mt-4">
                +{pendingTasks - 5} more tasks
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 