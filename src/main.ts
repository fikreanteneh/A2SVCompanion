import "./style.css";

const huberror = document.getElementById("huberror");
const hubsuccess = document.getElementById("hubsuccess");

chrome.storage.local.get(["identifier"], (result) => {
  const identifier = result.identifier;
  if (identifier) {
    huberror.style.display = "none";
  }
  if (!identifier) {
    hubsuccess.style.display = "none";
  }
})
