import { useState, useEffect } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { useRouter } from 'next/router'

import { TodoStatusSchema } from '@/server/api/schemas/todo-schemas'
import { CreateTodoForm } from '@/client/components/CreateTodoForm'
import { TodoList } from '@/client/components/TodoList'
import { api } from '@/utils/client/api'

/**
 * QUESTION 6:
 * -----------
 * Implement quick filter/tab feature so that we can quickly find todos with
 * different statuses ("pending", "completed", or both). The UI should look like
 * the design on Figma.
 *
 * NOTE:
 *  - For this question, you must use RadixUI Tabs component. Its Documentation
 *  is linked below.
 *
 * Documentation references:
 *  - https://www.radix-ui.com/docs/primitives/components/tabs
 */
export type TodoItem = {
  status: 'completed' | 'pending'
  id: number
  body: string
}

const Index = () => {
  const router = useRouter()
  const initialTab = router.query.tab as string
  const [valueTab, setValueTab] = useState(initialTab)
  const { data: todos = [] } = api.todo.getAll.useQuery({
    statuses: ['completed', 'pending'],
  })

  const statusTabs = ['completed,pending', ...TodoStatusSchema.options]

  useEffect(() => {
    setValueTab(router.query.tab as string)
  }, [router.query.tab])

  useEffect(() => {
    if (!initialTab) {
      router.push({ query: { tab: 'completed,pending' } })
    }
  })

  const filteredTodos: Array<TodoItem> = todos.filter((todo) => {
    return valueTab?.split(',').includes(todo.status)
  })

  return (
    <main className="mx-auto w-[480px] pt-12">
      <div className="rounded-12 bg-white p-8 shadow-sm">
        <h1 className="text-center text-4xl font-extrabold text-gray-900">
          Todo App
        </h1>
        <div className="pt-10">
          <Tabs.Root
            orientation="vertical"
            value={valueTab}
            onValueChange={(value) => {
              setValueTab(value)
              router.push({ query: { tab: value } })
            }}
          >
            <Tabs.List
              aria-label="tabs example"
              className="grid grid-flow-col gap-2"
            >
              {statusTabs.map((tab) => (
                <Tabs.Trigger
                  key={tab}
                  value={tab}
                  className="rounded-full border border-gray-200 px-6 py-3 text-[14px] font-bold text-gray-700 data-[state=active]:bg-gray-700 data-[state=active]:text-white
                  "
                >
                  {tab.includes(',') ? 'All' : tab.charAt(0) + tab.slice(1)}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>
        </div>

        <div className="pt-10">
          <TodoList todoListass={filteredTodos} />
        </div>

        <div className="pt-10">
          <CreateTodoForm />
        </div>
      </div>
    </main>
  )
}

export default Index
