import { useLoaderData } from "react-router-dom";
import { getTodos } from "../api/todos";
import { TodoItem } from "../components/TodoItem";
import { Suspense } from "react";
import { Await } from "react-router";

function TodoList() {
  const { todosPromise } = useLoaderData();
  return (
    <>
      <h1 className="page-title">Todos</h1>
      <ul>
        <Suspense fallback={<TodoSkeleton />}>
          <Await resolve={todosPromise}>
            {t => t.map(todo => <TodoItem key={todo.id} {...todo} />)}
          </Await>
        </Suspense>
      </ul>
    </>
  );
}

export function TodoSkeleton() {
  const arr = [...Array(40).keys()];

  return (
    <>
      {arr.map(i => (
        <li key={i}>
          <div className="skeleton"></div>
        </li>
      ))}
    </>
  );
}

function loader({ request: { signal } }) {
  const todosPromise = getTodos({ signal });
  return { todosPromise };
}

export const todoListRoute = {
  loader,
  element: <TodoList />,
};
