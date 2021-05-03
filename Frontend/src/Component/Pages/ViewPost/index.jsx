import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useQuery, gql, useSubscription, useMutation } from "@apollo/client";
import {
    CommentSubscription,
    CreateComment,
    GetAllComments,
    GetPostGQLQuery,
} from "./GQL";
import "./style.scss";
import Markdown from "markdown-to-jsx";
import { DateFormatandMinutes } from "../../Helper/dateFormat";
import Swal from "sweetalert2";

export default function ViewPost() {
    const { postId } = useParams();
    const history = useHistory();
    const token =
        sessionStorage.getItem("token") || localStorage.getItem("token");

    const [post, setPost] = useState("");
    const [comments, setComment] = useState(null);
    const [newSubscriptionId, setNewSubscriptionId] = useState("");
    const [commentMessage, setCommentMessage] = useState("");
    !postId && history.push("/");

    let { data: postData, error: postError } = useQuery(GetPostGQLQuery, {
        variables: { id: postId },
    });
    let { data: commentData } = useQuery(GetAllComments, {
        variables: { postId: postId },
    });
    let { data: commentSubscriptionData } = useSubscription(
        CommentSubscription,
        { variables: { postId } }
    );
    const [
        createCommentMutation,
        { data: createMutationData, error: createMutationError },
    ] = useMutation(CreateComment);

    if (postData && !post) {
        setPost(postData.getPostById);
    }

    if (postError) {
        console.log({ postError });
        if (postError) {
            console.log(postError);
            Swal.fire("Error", "Error Connecting Server", "error").then(() => {
                sessionStorage.clear();
                history.push("/login");
            });
        }
    }
    if (commentData && !comments) {
        setComment(commentData.getPostComment.comment);
    }

    if (commentSubscriptionData) {
        if (commentSubscriptionData._id !== newSubscriptionId) {
            setNewSubscriptionId(commentSubscriptionData._id);
            setComment((comments) => [
                ...comments,
                commentSubscriptionData.commentListSubscription,
            ]);
        }
    }
    if (createMutationError) {
        console.log({ createMutationError });
    }
    if (createMutationData) {
        Swal.fire("Success", "COmment Successfully Added", "success").then(() =>
            window.location.reload()
        );
    }

    const createCommentFunction = (e) => {
        e.preventDefault();
        createCommentMutation({
            variables: { description: commentMessage, postId },
        });
    };
    return (
        <>
            <div className="view-post">
                <span className="back" onClick={() => history.push("/")}>
                    back
                </span>
                <div className="content">
                    <h1>{post.title}</h1>
                    <div className="author">
                        <span>Created By: {post.name}</span>
                        <span>
                            Created At:{" "}
                            {DateFormatandMinutes(parseInt(post.updatedAt))}
                        </span>
                    </div>
                    <div className="content">
                        {post.markdown && <Markdown>{post.markdown}</Markdown>}
                    </div>
                    {comments ? (
                        <div className="comment">
                            <h2>Comments</h2>
                            {comments.map(
                                ({ description, name, createdAt }) => {
                                    return (
                                        <div className="single-comment">
                                            <div className="comment">
                                                {description}
                                            </div>
                                            <div className="footer">
                                                <span>
                                                    Commented By: {name}
                                                </span>
                                                <span>
                                                    Commented At:{" "}
                                                    {DateFormatandMinutes(
                                                        parseInt(createdAt)
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    ) : (
                        ""
                    )}
                    {token ? (
                        <div className="create-Comment">
                            <form
                                onSubmit={createCommentFunction}
                                className="create-Comment"
                            >
                                <input
                                    placeholder="Add New Comments"
                                    onChange={({ target: { value } }) =>
                                        setCommentMessage(value)
                                    }
                                    value={commentMessage}
                                    type="text"
                                />
                                <button type="submit">Create</button>
                            </form>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </>
    );
}
