import React, { useEffect, useState } from "react";
import ProfileAvatar from "./ProfileAvatar";

const Profile = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState({});
  const email = JSON.parse(localStorage.getItem("user")).email;

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    let result = await fetch("http://localhost:8000/users", {
      headers: {
        authorization: JSON.parse(localStorage.getItem("token")),
        userid: JSON.parse(localStorage.getItem("user"))._id,
      },
    });

    result = await result.json();
    if (result.error) {
      setSuccess(false);
    } else {
      setName(result.name);
      setPassword(result.password);
      delete result.password;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(name, password);

    const data = await fetch("http://localhost:8000/users", {
      method: "put",
      body: JSON.stringify({ name, password }),
      headers: {
        "Content-Type": "application/json",
        authorization: JSON.parse(localStorage.getItem("token")),
        userid: JSON.parse(localStorage.getItem("user"))._id,
      },
    });
    const result = await data.json();
    console.log(result);
    if (result.acknowledged) {
      setSuccess({ isUpdated: true, message: "profile updated Successfully" });
      const _id = JSON.parse(localStorage.getItem("user"))._id;
      const user = { _id, name, email };
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      setSuccess({
        isUpdated: false,
        message: "Could not update profile. Try Again Later",
      });
    }
  };

  return (
    <div className="container profile">
      {success.isUpdated ? success.message : success.message}
      <h2>Profile</h2>
      <form onSubmit={handleSubmit}>
        <ProfileAvatar />

        <div>
          <label htmlFor="name">Enter Name</label>
          <input
            id="name"
            type="text"
            className="input"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>

        {/* <div>
          <label htmlFor="last-name">Enter Last Name</label>
          <input
            id="last-name"
            type="text"
            className="input"
            placeholder="Last name"
          />
        </div> */}

        <div>
          <label htmlFor="staticEmail">Email</label>
          <input
            type="text"
            readOnly
            className="readOnlyInput"
            id="staticEmail"
            value={email}
          />
        </div>

        <div>
          <label htmlFor="inputPassword">Password</label>

          <input
            type="password"
            id="inputPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
