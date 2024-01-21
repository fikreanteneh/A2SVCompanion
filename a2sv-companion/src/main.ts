import "./style.css";

import { getRepos } from "./lib/github";
import { getLocalStorage } from "./utils/readStorage";

const login = () => {
  chrome.tabs.create({
    url: `https://github.com/apps/a2sv-companion/installations/new`,
  });
};

const logout = () => {
  chrome.storage.local.clear(() => {});
};

const populateRepo = async (
  selector: HTMLSelectElement,
  selected: string = "",
) => {
  const repos = await getRepos();

  repos.map((repo): void => {
    const option = document.createElement("option");
    option.value = repo.name;
    option.text = repo.name;
    option.selected = repo.name === selected;
    selector.appendChild(option);
  });
};

const repoSelector = document.getElementById("repos");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const uploadBtn = document.getElementById("upload-btn");
const studentName = document.getElementById("student-name");
const greeting = document.getElementById("greeting");
const folderField = document.getElementById("folder-path");
const reposField = document.getElementById("repos") as HTMLSelectElement;

chrome.storage.local.get(["token", "user"], async (result) => {
  if (result.token) {
    loginBtn.classList.toggle("hidden", true);
    logoutBtn.classList.toggle("hidden", false);

    greeting.classList.toggle("hidden", false);
    greeting.innerHTML = `${result.user.login}`;

    const student = await getLocalStorage("studentName");
    const selectedRepo = await getLocalStorage("selectedRepo");
    const folder = await getLocalStorage("folderPath");

    if (folder) {
      folderField.setAttribute("value", folder);
    }

    if (student) {
      studentName.setAttribute("value", student);
    }

    populateRepo(repoSelector as HTMLSelectElement, selectedRepo);
  }
});

loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);

reposField.addEventListener("change", async (event) => {
  const selectedRepo = (event.target as HTMLSelectElement).value;
  await chrome.storage.local.set({ selectedRepo });
});

folderField.addEventListener("change", async (event) => {
  const folderPath = (event.target as HTMLInputElement).value;
  await chrome.storage.local.set({ folderPath });
});

studentName.addEventListener("change", async (event) => {
  const studentName = (event.target as HTMLInputElement).value;
  await chrome.storage.local.set({ studentName });
});
