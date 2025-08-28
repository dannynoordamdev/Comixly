import React, { useState, useEffect } from "react";
import "../Styling/Components/Library.css";

function Library() {
  const [libraries, setLibraries] = useState([]);
  const [newLibraryName, setNewLibraryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLibraries = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://api.comixly.tech/user/library", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch libraries");
        const data = await res.json();
        setLibraries(data.library);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLibraries();
  }, []);

  const handleCreateLibrary = async (e) => {
    e.preventDefault();
    if (!newLibraryName.trim()) return;
    setLoading(true);
    try {
      const params = { name: newLibraryName };
      const res = await fetch("https://api.comixly.tech/user/library", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: new URLSearchParams(params),
      });
      if (!res.ok) throw new Error("Failed to create library");
      const data = await res.json();
      setLibraries([...libraries, data.library]);
      setNewLibraryName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLibrary = async (id) => {
    if (!window.confirm("Are you sure you want to delete this library?"))
      return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.comixly.tech/user/library?library_id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete library");
      setLibraries(libraries.filter((lib) => lib.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const viewLibrary = () => {
    alert("Feature coming soon!");
  };

  return (
    <div className="library-container">
      {loading && <p>Loading...</p>}

      <div className="create-library">
        <input
          type="text"
          placeholder="Name Library"
          value={newLibraryName}
          onChange={(e) => setNewLibraryName(e.target.value)}
        />
        <button onClick={handleCreateLibrary} disabled={!newLibraryName.trim()}>
          Create
        </button>
      </div>
      <hr className="content-divider-dashboard" />

      {libraries.length === 0 ? (
        <p>Create your first library, ideal for storing comics.</p>
      ) : (
        <div className="libraries-list">
          {libraries.map((library) => (
            <span key={library.id} className="library-card">
              <h3>{library.name}</h3>
              <div className="buttons-library-card">
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteLibrary(library.id)}
                >
                  Delete
                </button>
              </div>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default Library;
