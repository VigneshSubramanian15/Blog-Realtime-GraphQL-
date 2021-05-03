import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useQuery, useSubscription } from "@apollo/client";
import "./style.scss";
import { GetBlogData, PostSubscription } from "./GQL";
import { DateFormat } from "../../Helper/dateFormat";
import Swal from "sweetalert2";

export default function HomePage() {
    const history = useHistory();
    const token =
        sessionStorage.getItem("token") || localStorage.getItem("token");
    const [blogs, setBlogData] = useState([]);
    const [newBlog, setNewBlog] = useState();
    let { data: blogData, loading: blogLoading, error: blogError } = useQuery(
        GetBlogData
    );

    let {
        data: postSubscriptionData,
        loading: postSubscriptionLoading,
        error: postSubscriptionError,
    } = useSubscription(PostSubscription);

    if (blogData && blogData.getAllPost.length && !blogs.length) {
        setBlogData(blogData.getAllPost);
    }
    if (blogError) {
        Swal.fire("Error", "Error Connecting Server", "error");
    }
    if (postSubscriptionData) {
        if (postSubscriptionData.postListSubscription._id !== newBlog) {
            setNewBlog(postSubscriptionData.postListSubscription._id);

            setBlogData((blogs) => [
                ...blogs,
                postSubscriptionData.postListSubscription,
            ]);
        }
    }
    postSubscriptionLoading && console.log({ postSubscriptionLoading });
    postSubscriptionError && console.log({ postSubscriptionError });
    return (
        <div className="homepage">
            <div className="content">
                <h1>
                    Welcome{" "}
                    {token ? (
                        <>
                            <span onClick={() => history.push("/create")}>
                                Create A New Blog Post
                            </span>
                            <span
                                onClick={() => {
                                    sessionStorage.clear();
                                    history.push("/login");
                                }}
                            >
                                Logout
                            </span>
                        </>
                    ) : (
                        <span onClick={() => history.push("/login")}>
                            Login
                        </span>
                    )}{" "}
                </h1>

                <div className="blog-list">
                    {blogs &&
                        blogs.map(
                            ({
                                shortDescription,
                                name,
                                updatedAt,
                                title,
                                _id,
                            }) => {
                                return (
                                    <div
                                        onClick={() =>
                                            history.push("/view/" + _id)
                                        }
                                        className="blog-content"
                                    >
                                        <strong>{title}</strong>
                                        <p>{shortDescription}</p>
                                        <div className="footer">
                                            <span>By: {name}</span>{" "}
                                            <span>
                                                Created At:{" "}
                                                {DateFormat(
                                                    parseInt(updatedAt)
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                </div>
            </div>
        </div>
    );
}
