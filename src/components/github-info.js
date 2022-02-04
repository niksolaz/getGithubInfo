import React, {useState, useEffect} from "react";
import axios from "axios"

const url = "https://api.github.com/users/niksolaz";

const ConditionalCompining = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [repos, setRepos] = useState([]);

  const getData = async () => {
    setLoading(true);
    setError(false);
    try { 
      const response = await axios.get(url)
        const {login, name, bio, avatar_url:img, html_url:profile, repos_url:repoURL} = response.data;
        setUsers({login, name, bio, img, profile});
        const responseRepo = await axios.get(repoURL);
        setRepos(responseRepo.data);
        window.sessionStorage.setItem("users", JSON.stringify(users));
        window.sessionStorage.setItem("repos", JSON.stringify(repos));
    } catch(error) {
      setError(true);
      console.log(error);
    }
    if(repos.length > 0) {
      setLoading(false);
    }
  }

  const storageData = () => {
    const usersStorage = sessionStorage.getItem("users");
    const reposStorage = sessionStorage.getItem("repos");
    let checkStorageNotNull = (usersStorage !== null && reposStorage !== null) ? true : false;
    if(checkStorageNotNull) {
      let checkStorageNotEmpty = (JSON.parse(usersStorage).length > 0 && JSON.parse(reposStorage).length > 0) ? true : false;
      if(checkStorageNotEmpty) {
        setUsers(JSON.parse(usersStorage));
        setRepos(JSON.parse(reposStorage));
      } else {
        getData();
      }      
    } else {
      getData();
    } 
  }
  
  useEffect(() => {
    storageData()
  })
  if(isLoading) {
    return <Loading/>
  } 

  if(isError) {
    return <Error />
  } 
    
  return (
      <div className="item shadow">
        <div>
          <h1>{users.name}</h1>
          <p>{users.login}</p>
          <p>{users.bio}</p>
          <p><a href={users.profile} target="_blank" rel="noreferrer">Profile</a></p>
          <img src={users.img} alt="avatar" className="img-300 border-50 shadow"/>
          <div className="mt-5">
            <h5>Repository</h5>
            <hr/>
            {
              repos.map(el => {
                const {size, visibility, description, full_name, html_url} = el;
                return <div key={el.id} className="p-3">
                  <p><b>Name:</b> <a href={html_url} target="_blank" rel="noreferrer">{full_name}</a></p>
                  <p><b>Description:</b> {description}</p>
                  <p><b>Visibility:</b> {visibility}</p>
                  <p><b>Size:</b> {size}</p>
                  <hr/>
                </div>
              })
            }
          </div>
        </div>
      </div>
    );
};

const Loading = () => {
  return (
    <div className="item text-center shadow">
      <div className="loader">
        <h2>Loading </h2>
        <div className="icon-1"></div>
        <div className="icon-2"></div>
        <div className="icon-3"></div>
        <div className="icon-4"></div>
      </div>
    </div>
  )
}

const Error = () => {
  return (
    <div className="item text-center shadow">
          <h2>Sorry, there is an Error!!! </h2>
    </div>
  )
}

export default ConditionalCompining;
