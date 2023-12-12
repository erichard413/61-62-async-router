import { Link, useLoaderData } from "react-router-dom";
import { getUsers } from "../api/users";
import { Suspense } from "react";
import { Await } from "react-router";

function UserList() {
  const { usersPromise } = useLoaderData();

  return (
    <>
      <h1 className="page-title">Users</h1>
      <div className="card-grid">
        <Suspense fallback={<UserListSkeleton />}>
          <Await resolve={usersPromise}>
            {users =>
              users.map(user => (
                <div key={user.id} className="card">
                  <div className="card-header">{user.name}</div>
                  <div className="card-body">
                    <div>{user.company.name}</div>
                    <div>{user.website}</div>
                    <div>{user.email}</div>
                  </div>
                  <div className="card-footer">
                    <Link className="btn" to={user.id.toString()}>
                      View
                    </Link>
                  </div>
                </div>
              ))
            }
          </Await>
        </Suspense>
      </div>
    </>
  );
}

function UserListSkeleton() {
  const arr = [...Array(16).keys()];
  return (
    <>
      {arr.map(i => (
        <div key={i} className="card">
          <div className="card-header">
            <div className="skeleton"></div>
          </div>
          <div className="card-body">
            <div className="skeleton"></div>
            <div className="skeleton"></div>
            <div className="skeleton"></div>
          </div>
          <div className="card-footer">
            <Link className="skeleton skeleton-btn"></Link>
          </div>
        </div>
      ))}
    </>
  );
}

function loader({ request: { signal } }) {
  const usersPromise = getUsers({ signal });
  return { usersPromise };
}

export const userListRoute = {
  loader,
  element: <UserList />,
};
