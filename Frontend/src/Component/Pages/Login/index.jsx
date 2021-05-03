import React, { useState } from "react";
import "./style.scss";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useLazyQuery } from "@apollo/client";
import { LoginGQLQuery } from "./loginGQL";
import { useHistory } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const history = useHistory();

    let [loginGraphQL, { data, error }] = useLazyQuery(LoginGQLQuery);

    const login = (e) => {
        e.preventDefault();
        loginGraphQL({ variables: { email: username, password } });
    };

    if (data) {
        sessionStorage.setItem("token", data.login);
        history.push("/");
    }
    if (error) {
        console.log({ error });
        error = null;
    }
    return (
        <div className="login-wrapper">
            <div className="login">
                <h1>Login</h1>
                <form onSubmit={login}>
                    <div className="input-field">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="text"
                            name="email"
                            id="email"
                            value={username}
                            onChange={({ target: { value } }) =>
                                setUsername(value)
                            }
                        />
                    </div>
                    <div className="input-field">
                        <label htmlFor="password">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            value={password}
                            onChange={({ target: { value } }) =>
                                setPassword(value)
                            }
                        />
                        <span
                            onClick={() =>
                                setShowPassword((showPassword) => !showPassword)
                            }
                        >
                            {!showPassword ? (
                                <AiFillEye />
                            ) : (
                                <AiFillEyeInvisible />
                            )}
                        </span>
                    </div>
                    <button type="submit">Login</button>
                    <small
                        onClick={() => {
                            history.push("/register");
                        }}
                    >
                        {" "}
                        Register to continue
                    </small>
                </form>
            </div>
        </div>
    );
}
