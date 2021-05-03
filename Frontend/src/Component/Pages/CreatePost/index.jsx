import React, { useState } from "react";
import "./style.scss";
import "react-markdown-editor-lite/lib/index.css";
import Markdown from "markdown-to-jsx";
import { useMutation } from "@apollo/client";
import { CreateBlog } from "./GQL";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { AiOutlineLoading } from "react-icons/ai";
import { VerifyToken } from "../../Helper/verifyToken";
// import MdEditor from "react-markdown-editor-lite";
// import MarkdownIt from "markdown-it";

export default function CreatePost() {
    // const [markdownVal, setMarkdownVal] = useState("");
    // const mdParser = new MarkdownIt(/* Markdown-it options */);
    let history = useHistory();
    VerifyToken();
    const [markdown, setMarkdown] = useState("");
    const [shortDescription, setshortDescription] = useState("");
    const [title, settitle] = useState("");
    const [createBlogMutation, { data, error, loading }] = useMutation(
        CreateBlog
    );

    const createBlog = () => {
        createBlogMutation({
            variables: { title, shortDescription, markdown },
        });
    };
    if (data) {
        Swal.fire(
            "Success",
            "The post has been successfully created",
            "success"
        ).then(() => history.push("/"));
    }
    if (error) {
        Swal.fire("Error", "Error Connecting Server", "error").then(() => {
            sessionStorage.clear();
            history.push("/login");
        });
    }
    return (
        <div className="createPost">
            <h2>Create Post</h2>
            {/* <MdEditor
                style={{ height: "500px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={(d) => setMarkdownVal(d)}
            /> */}
            <div className="post">
                <div className="create">
                    <div className="input-field">
                        <label htmlFor="email">Blog Title</label>
                        <input
                            onChange={({ target: { value } }) =>
                                settitle(value)
                            }
                            value={title}
                            type="text"
                            name="email"
                            id="email"
                        />
                    </div>
                    <div className="input-field">
                        <label htmlFor="email">Short Description</label>
                        <input
                            type="text"
                            onChange={({ target: { value } }) =>
                                setshortDescription(value)
                            }
                            value={shortDescription}
                            name="email"
                            id="email"
                        />
                    </div>
                    <div className="input-field">
                        <label htmlFor="email">Blog Content</label>
                        <textarea
                            name="Blog-content"
                            id="blog-content"
                            onChange={({ target: { value } }) =>
                                setMarkdown(value)
                            }
                            cols="50"
                            rows="30"
                        >
                            {markdown}
                        </textarea>
                    </div>
                    <button onClick={createBlog}>
                        {loading ? (
                            <span>
                                <AiOutlineLoading />
                            </span>
                        ) : (
                            " Create"
                        )}
                    </button>
                </div>
                <div className="preview">
                    <div className="title">{title}</div>
                    <div className="shortdesc">{shortDescription}</div>
                    <Markdown>{markdown}</Markdown>
                </div>
            </div>
        </div>
    );
}
