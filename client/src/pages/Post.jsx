import { Link } from "react-router-dom";
import { useLoaderData, defer } from "react-router";
import { getComments } from "../api/comments";
import { getPost } from "../api/posts";
import { getUser } from "../api/users";
import { Suspense } from "react";
import { Await } from "react-router";

function Post() {
  const { postPromise, userPromise, commentsPromise } = useLoaderData();

  return (
    <>
      <Suspense
        fallback={
          <>
            <h1 className="page-title">
              <div className="skeleton"></div>
              <div className="title-btns">
                <Link className="skeleton skeleton-btn"></Link>
              </div>
            </h1>
          </>
        }
      >
        <Await resolve={postPromise}>
          {post => (
            <h1 className="page-title">
              {post.title}
              <div className="title-btns">
                <Link className="btn btn-outline" to="edit">
                  Edit
                </Link>
              </div>
            </h1>
          )}
        </Await>
      </Suspense>

      <span className="page-subtitle">
        <Suspense
          fallback={
            <>
              By: <div className="skeleton"></div>
            </>
          }
        >
          <Await resolve={userPromise}>
            {user => (
              <>
                By: <Link to={`/users/${user.id}`}>{user.name}</Link>
              </>
            )}
          </Await>
        </Suspense>
      </span>
      <Suspense fallback={<div className="skeleton"></div>}>
        <Await resolve={postPromise}>{post => <div>{post.body}</div>}</Await>
      </Suspense>

      <h3 className="mt-4 mb-2">Comments</h3>
      <div className="card-stack">
        <Suspense fallback={<CommentsSkeleton />}>
          <Await resolve={commentsPromise}>
            {comments => (
              <>
                {comments.map(comment => (
                  <div key={comment.id} className="card">
                    <div className="card-body">
                      <div className="text-sm mb-1">{comment.email}</div>
                      {comment.body}
                    </div>
                  </div>
                ))}
              </>
            )}
          </Await>
        </Suspense>
      </div>
    </>
  );
}

function CommentsSkeleton() {
  const arr = [...Array(10).keys()];
  return (
    <>
      {arr.map(i => (
        <div key={i} className="card">
          <div className="card-body">
            <div className="text-sm mb-1">
              <div className="skeleton"></div>
            </div>
            <div className="skeleton"></div>
          </div>
        </div>
      ))}
    </>
  );
}

async function loader({ request: { signal }, params: { postId } }) {
  const comments = getComments(postId, { signal });
  const post = getPost(postId, { signal });

  return defer({
    commentsPromise: comments,
    postPromise: post,
    userPromise: post.then(post => getUser(post.userId, { signal })),
  });
}

export const postRoute = {
  loader,
  element: <Post />,
};
