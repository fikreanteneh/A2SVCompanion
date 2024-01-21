// Mock data for coding platforms and questions
import { upload } from "./lib/github/index";
import a2sv from "./lib/a2sv/index";
import "./style.css";
import config from "./config";
interface PlatformData {
  platforms: string[];
}

async function fetchData(url: string): Promise<any> {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function getPlatforms(): Promise<PlatformData> {
  populateDropdown("coding-platform", ["loading..."]);

  try {
    const data = await fetchData(`${config.api.url}/platform`);
    populateDropdown("coding-platform", data.platforms);
    await getQuestions(data.platforms[0].toLowerCase());
    return data;
  } catch (error) {
    console.error("Error fetching platform data:", error);
    chrome.notifications.create("a2sv-companion", {
      type: "basic",
      iconUrl: "icons/icon_128.png",
      title: "Error",
      message: "An error occured while fetching platform data",
    });
    // Handle the error as needed
    return { platforms: [] };
  }
}

getPlatforms();

async function getQuestions(platform: string) {
  populateQuestionDropDown("available-questions", [
    { URL: "loading...", Title: "loading..." },
  ]);

  try {
    const data = await fetchData(
      `${config.api.url}/platform/${platform}/question`,
    );
    console.log(data);
    populateQuestionDropDown(
      "available-questions",
      data.questions as QuestionInterface[],
    );
    return data;
  } catch (error) {
    console.error("Error fetching question data:", error);
    chrome.notifications.create("a2sv-companion", {
      type: "basic",
      iconUrl: "icons/icon_128.png",
      title: "Error",
      message: "An error occured while fetching question data",
    });
    // Handle the error as needed
    return { questions: [] };
  }
}

// Function to populate dropdown options
function populateDropdown(
  selectId: string,
  options: string[],
  selectedValue = "",
) {
  const selectElement = document.getElementById(selectId) as HTMLSelectElement;
  selectElement.innerHTML = ""; // Clear existing options
  options.forEach((option) => {
    const optionElement = createOptionElement(option, option);
    selectElement.add(optionElement);
  });
  if (selectedValue) {
    selectElement.value = selectedValue;
  }
}

interface QuestionInterface {
  URL: string;
  Title: string;
}

function populateQuestionDropDown(
  selectId: string,
  options: QuestionInterface[],
) {
  options.sort((a, b) => { return a.Title.localeCompare(b.Title) });
  const selectElement = document.getElementById(selectId) as HTMLSelectElement;
  selectElement.innerHTML = ""; // Clear existing options
  options.forEach((option) => {
    const optionElement = createOptionElement(option.URL, option.Title);
    optionElement.classList.add("px-2");
    selectElement.add(optionElement);
  });
}

function createOptionElement(value: string, text: string): HTMLOptionElement {
  const optionElement = document.createElement("option");
  // truncate if the lenght is to much
  if (text.length > 50) {
    text = text.substring(0, 50) + "...";
  }
  optionElement.value = value;
  optionElement.text = text;
  return optionElement;
}

// Event listener for coding platform change
document
  .getElementById("coding-platform")
  ?.addEventListener("change", async function () {
    const selectedPlatform = (this as HTMLSelectElement).value as string;
    await getQuestions(selectedPlatform.toLowerCase());
  });

function getFormValues(): FormValues {
  const codingPlatform = getValueById("coding-platform");
  const availableQuestions = getValueById("available-questions");
  const code = getValueById("code").trim();
  const timeTaken = parseInt(getValueById("time-taken"), 10) || 0;
  const attempts = parseInt(getValueById("attempts"), 10) || 0;
  return {
    codingPlatform,
    availableQuestions,
    timeTaken,
    code,
    attempts,
  };
}

function getValueById(id: string): string {
  return (document.getElementById(id) as HTMLSelectElement).value;
}

interface FormValues {
  codingPlatform: string;
  availableQuestions: string;
  code: string;
  timeTaken: number;
  attempts: number;
}

function checkFields() {
  const { codingPlatform, availableQuestions, code, timeTaken, attempts } =
    getFormValues();
  const submitButton = document.getElementById(
    "submit-btn",
  ) as HTMLButtonElement;
  console.log(submitButton);
  submitButton.disabled = !(
    codingPlatform &&
    availableQuestions &&
    code &&
    timeTaken &&
    attempts
  );
  updateSubmitButtonStyle(submitButton.disabled);
}

function updateSubmitButtonStyle(disabled: boolean) {
  const submitButton = document.getElementById(
    "submit-btn",
  ) as HTMLButtonElement;
  if (disabled) {
    submitButton.classList.remove("hover:bg-blue-600");
    submitButton.classList.add("cursor-not-allowed");
  } else {
    submitButton.classList.remove("cursor-not-allowed");
    submitButton.classList.add("hover:bg-blue-600");
  }
}

function onSubmit() {
  const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;
  submitBtn.disabled = true; // Disable the button to prevent multiple submissions
  submitBtn.innerHTML = "submiting...";
  submitBtn.classList.add("cursor-not-allowed");

  const formdata = getFormValues();

  chrome.storage.local
    .get(["selectedRepo", "folderPath", "studentName"])
    .then((storage) => {
      const ext = "py";
      const questionRef = document.getElementById(
        "available-questions",
      ) as HTMLSelectElement;
      let question = questionRef.options[
        questionRef.selectedIndex
      ].text.replace(/\s+/g, "");

      const folderPath =
        storage.folderPath[storage.folderPath.length - 1] === "/"
          ? storage.folderPath
          : `${storage.folderPath}/`;

      const fileRelativePath = `${folderPath}${formdata.codingPlatform}/${question}.${ext}`;

      upload(
        storage.selectedRepo,
        fileRelativePath,
        formdata.code,
        `Add solution for ${question}`,
      )
        .then((gitUrl) => {
          a2sv
            .pushToSheet(
              storage.studentName,
              formdata.attempts,
              formdata.timeTaken,
              formdata.availableQuestions,
              formdata.codingPlatform,
              gitUrl,
            )
            .then((result) => {
              // send notification

              if (result) {
                submitBtn.innerHTML = "submitted";
                submitBtn.classList.remove("hover:bg-blue-600");
                submitBtn.classList.remove("bg-blue-500");
                submitBtn.classList.add("bg-green-500");
                submitBtn.classList.add("cursor-not-allowed");
                sendNotification("Success", "Your solution has been submitted");
                setTimeout(() => {
                  submitBtn.innerHTML = "submit";
                  submitBtn.disabled = false;
                  submitBtn.classList.remove("bg-green-500");
                  submitBtn.classList.remove("cursor-not-allowed");
                  submitBtn.classList.add("bg-blue-500");
                  submitBtn.classList.add("hover:bg-blue-600");
                }, 3000);
              } else {
                submitBtn.innerHTML = "error";
                submitBtn.classList.remove("hover:bg-blue-600");
                submitBtn.classList.remove("bg-blue-500");
                submitBtn.classList.add("bg-red-500");
                submitBtn.classList.add("cursor-not-allowed");
                sendNotification("Error", "An error occured while submitting");
                setTimeout(() => {
                  submitBtn.innerHTML = "submit";
                  submitBtn.disabled = false;
                  submitBtn.classList.remove("cursor-not-allowed");
                  submitBtn.classList.remove("bg-red-500");
                  submitBtn.classList.add("hover:bg-blue-600");
                  submitBtn.classList.add("bg-blue-500");
                }, 3000);
              }
            })
            .catch((err) => {
              sendNotification("Error", "An error occured while submitting");
            });
        })
        .catch((err) => {
          sendNotification("Error", "An error occured while submitting");
        });
    });
}

checkFields();
document.getElementById("submit-btn").addEventListener("click", (e) => {
  console.log("button clicked");
  e.preventDefault();
  onSubmit();
});

// Listen for input events on the fields
[
  "coding-platform",
  "available-questions",
  "code",
  "time-taken",
  "attempts",
].forEach((fieldId) => {
  document.getElementById(fieldId).addEventListener("input", checkFields);
});

function sendNotification(title: string, message: string) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon_128.png",
    title,
    message,
  });
}
