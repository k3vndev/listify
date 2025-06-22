import { LoadingIcon, ReloadIcon } from '@/icons'
import { useTasksStore } from '@/store/tasks/useTasksStore'
import type { Task as TaskType } from '@/types'
import { dataFetch } from '@/utils/dataFetch'
import { Task } from '@components/tasks/Task'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export const TasksSection = () => {
  const setTasks = useTasksStore(s => s.setTasks)
  const tasks = useTasksStore(s => s.tasks)
  const [isOnError, setIsOnError] = useState(false)

  const { listId } = useParams()

  const loadTasks = () => {
    setIsOnError(false)

    dataFetch<TaskType[]>({
      url: `/api/tasks?list-id=${listId}`,
      onSuccess: data => setTasks(data),
      onError: () => setIsOnError(true)
    })
  }

  // Load tasks on mount
  useEffect(loadTasks, [])

  if (isOnError) {
    return (
      <MessageWrapper>
        <Message text='Error loading tasks.' className='text-red-600 font-bold' />
        <button
          className='py-2 px-4 bg-red-500/40 border border-red-500 rounded-md w-fit flex items-center gap-2'
          onClick={loadTasks}
        >
          <ReloadIcon className='text-red-600 size-6' />
          <Message text='Try again' className='text-red-600 font-semibold' />
        </button>
      </MessageWrapper>
    )
  }

  if (tasks === null)
    return <LoadingIcon className='animate-spin mx-auto my-2 size-12 text-zinc-500' />

  if (tasks.length === 0) {
    return (
      <MessageWrapper>
        <Message text='You dont have any tasks yet.' />
      </MessageWrapper>
    )
  }

  return (
    <ul className='flex flex-col gap-2 h-full overflow-y-scroll overflow-x-hidden'>
      {tasks.map(task => (
        <Task key={task.id} {...task} />
      ))}
    </ul>
  )
}

interface MessageProps {
  className?: string
  text: string
}

const Message = ({ className, text: message }: MessageProps) => (
  <span className={`text-zinc-500 ${className}`}>{message}</span>
)

const MessageWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className='flex flex-col items-center justify-center h-full gap-4'>{children}</div>
)
