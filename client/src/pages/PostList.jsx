import { Suspense, useEffect, useRef } from "react";
import { Form, Link, useLoaderData } from "react-router-dom";
import { getPosts } from "../api/posts";
import { getUsers } from "../api/users";
import { FormGroup } from "../components/FormGroup";
import { PostCard } from "../components/PostCard";
import { Await } from "react-router";

function PostList() {
  const {
    postsPromise,
    usersPromise,
    searchParams: { query, userId },
  } = useLoaderData();
  const queryRef = useRef();
  const userIdRef = useRef();

  useEffect(() => {
    queryRef.current.value = query || "";
  }, [query]);

  useEffect(() => {
    userIdRef.current.value = userId || "";
  }, [userId]);

  return (
    <>
      <h1 className="page-title">
        Posts
        <div className="title-btns">
          <Link className="btn btn-outline" to="new">
            New
          </Link>
        </div>
      </h1>

      <Form className="form mb-4">
        <div className="form-row">
          <FormGroup>
            <label htmlFor="query">Query</label>
            <input type="search" name="query" id="query" ref={queryRef} />
          </FormGroup>
          <FormGroup>
            <label htmlFor="userId">Author</label>{" "}
            <Suspense
              fallback={
                <select type="search" name="userId" id="userId" disabled>
                  <option className="skeleton" value="" ref={userIdRef}>
                    Loading...
                  </option>
                </select>
              }
            >
              <Await resolve={usersPromise}>
                {users => (
                  <>
                    <select
                      type="search"
                      name="userId"
                      id="userId"
                      ref={userIdRef}
                    >
                      <option value="">Any</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </Await>
            </Suspense>
          </FormGroup>

          <button className="btn">Filter</button>
        </div>
      </Form>

      <div className="card-grid">
        <Suspense fallback={<PostsSkeleton />}>
          <Await resolve={postsPromise}>
            {posts => posts.map(post => <PostCard key={post.id} {...post} />)}
          </Await>
        </Suspense>
      </div>
    </>
  );
}

export function PostsSkeleton() {
  const arr = [...Array(12).keys()];

  return (
    <>
      {arr.map(i => (
        <div key={i} className="card">
          <div className="card-header">
            <div className="skeleton"></div>
          </div>
          <div className="card-body">
            <div className="card-preview-text">
              <div className="skeleton"></div>
              <div className="skeleton"></div>
              <div className="skeleton"></div>
              <div className="skeleton"></div>
              <div className="skeleton"></div>
            </div>
          </div>
          <div className="card-footer">
            <Link disabled className="skeleton skeleton-btn"></Link>
          </div>
        </div>
      ))}
    </>
  );
}

async function loader({ request: { signal, url } }) {
  const searchParams = new URL(url).searchParams;
  const query = searchParams.get("query");
  const userId = searchParams.get("userId");
  const filterParams = { q: query };
  if (userId !== "") filterParams.userId = userId;

  const posts = getPosts({ signal, params: filterParams });
  const users = getUsers({ signal });

  return {
    postsPromise: posts,
    usersPromise: users,
    searchParams: { query, userId },
  };
}

export const postListRoute = {
  loader,
  element: <PostList />,
};
