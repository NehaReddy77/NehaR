import React, { useState, useEffect, lazy, Suspense } from "react";
import "./Project.css";
import Button from "../../components/button/Button";
import Loading from "../loading/Loading";
import { socialMediaLinks } from "../../portfolio";
import { projects } from "../../portfolio";

export default function Projects2() {
  const GithubRepoCard = lazy(() =>
    import("../../components/githubRepoCard/GithubRepoCard")
  );
  const FailedLoading = () => null;
  const renderLoader = () => <Loading />;
  const [repo, setrepo] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getShortDescription = (description) => {
    const words = description.split(" ");
    if (words.length > 20) {
      return words.slice(0, 20).join(" ") + "...";
    }
    return description;
  };
  useEffect(() => {
    const getRepoData = () => {
      fetch("/profile.json")
        .then((result) => {
          if (result.ok) {
            return result.json();
          }
          throw result;
        })
        .then((response) => {
          setrepoFunction(response.data.user.pinnedItems.edges);
        })
        .catch(function (error) {
          console.log(error);
          setrepoFunction("Error");
          console.log(
            "Because of this Error, nothing is shown in place of Projects section. Projects section not configured"
          );
        });
    };
    getRepoData();
  }, []);

  function setrepoFunction(array) {
    setrepo(array);
  }
  if (!(typeof repo === "string" || repo instanceof String)) {
    return (
      <Suspense fallback={renderLoader()}>
        <div className="main" id="projects2">
          <h1 className="project-title">Projects</h1>
          <div className="repo-cards-div-main">
            {repo.map((v, i) => {
              return <GithubRepoCard repo={v} key={v.node.id} />;
            })}
          </div>
          <div className="portfolio">
          {projects.map(project => (
            <div key={project.id} className="project-card">
              <h3>{project.title}</h3>
              <p>{project.techstack}</p>
              <p>
                  {expandedDescriptions[project.id]
                    ? project.description
                    : getShortDescription(project.description)}
                  <span
                    className="read-more"
                    onClick={() => toggleDescription(project.id)}
                  >
                    {expandedDescriptions[project.id] ? " Read Less" : " Read More"}
                  </span>
                </p>
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          ))}
        </div>
          <Button
            text={"More Projects"}
            className="project-button"
            href={socialMediaLinks.github}
            newTab={true}
          />
        </div>
      </Suspense>
    );
  } else {
    return <FailedLoading />;
  }
}
