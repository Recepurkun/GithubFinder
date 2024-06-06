import { useState, useRef } from "react";
import "./App.css";
import Error from "./components/Error";
import { Button, Input } from "./components/Styled";
import RepoCard from "./components/RepoCard";

function App() {
  const [userName, setUserName] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [moreInfo, setMoreInfo] = useState(false);
  const [userRepos, setUserRepos] = useState([]);

  const apiUrl = `https://api.github.com/users/${userName}`;

  const clickHandler = async () => {
    setLoading(true);
    setError(null);
    setUserData(null);
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) {
        throw new Error("User not found");
      }
      const data = await res.json();
      setUserData(data);

      const reposRes = await fetch(data.repos_url);
      if (!reposRes.ok) {
        throw new Error("Repositories not found");
      }
      const reposData = await reposRes.json();
      console.log(reposData);
      setUserRepos(reposData);
    } catch (err) {
      setError("Kullanıcı bulunamadı");
      console.log("hata: ", err);
    } finally {
      setLoading(false);
    }
  };

  const inputHandler = (e) => {
    setUserName(e.target.value);
  };

  const dateFormatter = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="container my-4">
      <div className="row">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="display-6 m-0">Github Finder</h4>
          <div>
            <Input
              type="text"
              placeholder="Kullanıcı adı giriniz"
              onChange={inputHandler}
              value={userName}
            />
            <Button $primary={true} onClick={clickHandler} disabled={loading}>
              {loading ? "Aranıyor..." : "Ara"}
            </Button>
            {error && <Error message={error} />}
          </div>
        </div>

        <hr />
      </div>

      <>
        {userData && (
          <div className="row">
            <div className="col-3">
              <img
                src={userData.avatar_url}
                alt={userData.name}
                className="img-fluid rounded-circle p-5"
              />

              <div className="d-flex flex-column px-5">
                <h4 className="fw-bold">{userData.name}</h4>
                <h6 className="fw-medium fst-italic">{userData.login}</h6>
                <h6 className="mb-2">{userData.bio}</h6>
                <hr />
                <div className="d-flex align-items-baseline flex-column">
                  <h6>
                    <i className="fa-solid fa-users me-2"></i>
                    {userData.followers}
                    <b> followers </b>
                  </h6>
                  <h6>
                    <i className="fa-solid fa-user-group me-1"></i>{" "}
                    {userData.following}
                    <b> following </b>
                  </h6>
                  <h6>
                    <i className="fa-solid fa-location-dot me-3"></i>
                    <b> {userData.location} </b>
                  </h6>
                </div>
                <hr />
              </div>

              <div className="d-flex justify-content-start px-5">
                <Button onClick={() => setMoreInfo(!moreInfo)}>
                  More Info
                </Button>
                {moreInfo && (
                  <>
                    <h6>
                      Oluşturulma Tarihi: {dateFormatter(userData.created_at)}
                    </h6>
                    <h6>
                      Güncellenme Tarihi: {dateFormatter(userData.updated_at)}
                    </h6>
                  </>
                )}
              </div>
            </div>

            <div className="col-9">
              <div className="d-flex flex-wrap">
                {userRepos.map((repo) => (
                  <RepoCard
                    key={repo.id}
                    repo={repo}
                    dateFormatter={dateFormatter}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
}

export default App;
