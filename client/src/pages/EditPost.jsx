import {
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import { getPost, updatePost } from "../api/posts";
import { getUsers } from "../api/users";
import { PostForm, postFormValidator } from "../components/PostForm";
import { Suspense } from "react";
import { Await } from "react-router";
import { FormGroup } from "../components/FormGroup";
import { Link, Form } from "react-router-dom";

function EditPost() {
  const { usersPromise, postPromise } = useLoaderData();
  const { state } = useNavigation();
  const errors = useActionData();
  const isSubmitting = state === "submitting";

  return (
    <>
      <h1 className="page-title">Edit Post</h1>
      <Suspense fallback={<EditPostSkeleton />}>
        <Await resolve={postPromise}>
          {post => (
            <Suspense>
              <Await resolve={usersPromise}>
                {users => (
                  <PostForm
                    users={users}
                    isSubmitting={isSubmitting}
                    errors={errors}
                    defaultValues={post}
                  />
                )}
              </Await>
            </Suspense>
          )}
        </Await>
      </Suspense>
    </>
  );
}

function EditPostSkeleton() {
  return (
    <Form method="post" className="form">
      <div className="form-row">
        <FormGroup errorMessage={null}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            className="skeleton-input"
            disabled
          />
        </FormGroup>
        <FormGroup errorMessage={null}>
          <label htmlFor="userId">Author</label>
          <select name="userId" id="userId" className="skeleton-input" disabled>
            <option className="skeleton-input">Loading...</option>
          </select>
        </FormGroup>
      </div>
      <div className="form-row">
        <FormGroup errorMessage={null}>
          <label htmlFor="body">Body</label>
          <textarea
            name="body"
            id="body"
            className="skeleton-input"
            disabled
          ></textarea>
        </FormGroup>
      </div>
      <div className="form-row form-btn-row">
        <div>
          <Link disabled className="skeleton skeleton-btn"></Link>
        </div>
        <div>
          <Link disabled className="skeleton skeleton-btn"></Link>
        </div>
      </div>
    </Form>
  );
}

async function loader({ request: { signal }, params: { postId } }) {
  const post = getPost(postId, { signal });
  const users = getUsers({ signal });

  return { postPromise: post, usersPromise: users };
}

async function action({ request, params: { postId } }) {
  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");
  const userId = formData.get("userId");

  const errors = postFormValidator({ title, userId, body });

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  const post = await updatePost(
    postId,
    { title, body, userId },
    { signal: request.signal }
  );

  return redirect(`/posts/${post.id}`);
}

export const editPostRoute = {
  loader,
  action,
  element: <EditPost />,
};
