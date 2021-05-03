import React, { useState } from "react";
import "./style.scss";
import {
    AiFillEye,
    AiOutlineLoading3Quarters,
    AiFillEyeInvisible,
} from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { useMutation } from "@apollo/client";
import { RegistrationGQLQuery } from "./GQL";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

export default function Registration() {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [Confirmpassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const history = useHistory();

    let [registerGraphQL, { loading, data, error }] = useMutation(
        RegistrationGQLQuery
    );

    const register = (e) => {
        e.preventDefault();
        registerGraphQL({
            variables: {
                email: username,
                password,
                name: firstname + " " + lastname,
            },
        });
    };

    if (data) {
        Swal.fire("Success", "Registered Successfully ", "success").then(() =>
            history.push("/login")
        );
    }
    if (error) {
        console.log({ error });
        error = null;
    }
    return (
        <div className="login-wrapper">
            <div className="login">
                <h1>Register</h1>
                <form onSubmit={register}>
                    <div className="input-field">
                        <label htmlFor="email">First Name</label>
                        <input
                            type="text"
                            name="email"
                            id="email"
                            value={firstname}
                            onChange={({ target: { value } }) =>
                                setFirstname(value)
                            }
                        />
                    </div>
                    <div className="input-field">
                        <label htmlFor="email">Last Name</label>
                        <input
                            type="text"
                            name="email"
                            id="email"
                            value={lastname}
                            onChange={({ target: { value } }) =>
                                setLastname(value)
                            }
                        />
                    </div>
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
                    <div className="input-field">
                        <label htmlFor="password">Confirm Password</label>
                        <input
                            type={"password"}
                            name="Cpassword"
                            id="Cpassword"
                            value={Confirmpassword}
                            onChange={({ target: { value } }) =>
                                setConfirmPassword(value)
                            }
                        />
                        {password === Confirmpassword ? (
                            <span style={{ color: "green" }}>
                                <TiTick />
                            </span>
                        ) : (
                            ""
                        )}
                    </div>
                    <button type="submit">
                        {loading ? <AiOutlineLoading3Quarters /> : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
