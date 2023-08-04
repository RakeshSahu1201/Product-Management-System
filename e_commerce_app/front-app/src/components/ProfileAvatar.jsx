import React, { useState, useRef, useEffect } from "react";

const ProfileAvatar = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    const id = JSON.parse(localStorage.getItem("user"))._id;

    try {
      const response = await fetch(`http://localhost:8000/profile/${id}.jpg`, {
        method: "get",
        headers: {
          authorization: JSON.parse(localStorage.getItem("token")),
        },
      });

      if (response.ok) {
        setSelectedImage(`http://localhost:8000/profile/${id}.jpg`);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);

      const form = new FormData();
      form.append("profile", file);
      setSelectedImage(file);
      console.log("upload file ", form);

      let data = await fetch("http://localhost:8000/upload-profile", {
        method: "post",
        body: form,
        headers: {
          authorization: JSON.parse(localStorage.getItem("token")),
          userid: JSON.parse(localStorage.getItem("user"))._id,
        },
      });

      data = await data.json();
      console.log(data);
      if (data.error)
        setError({
          isUploaded: false,
          message: "Could not upload the profile! Try again later",
        });
      if (data.result)
        setError({
          isUploaded: true,
          message: "Profile uploaded successfully!",
        });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      {error.isUploaded ? error.message : error.message}
      <div style={avatarContainerStyle}>
        {/* Hidden file input */}
        <input
          type="file"
          style={{ display: "none" }}
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageChange}
        />

        {/* Display the profile avatar */}
        <div style={avatarStyle} onClick={handleImageClick}>
          {selectedImage ? (
            <img src={selectedImage} alt="Profile Avatar" style={imageStyle} />
          ) : (
            <span style={placeholderStyle}>Click to choose an image</span>
          )}
        </div>
      </div>
    </>
  );
};

// Custom CSS styles
const avatarContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const avatarStyle = {
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  overflow: "hidden",
  cursor: "pointer",
  border: "2px solid #ccc",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const placeholderStyle = {
  fontSize: "16px",
  color: "#888",
};

export default ProfileAvatar;
