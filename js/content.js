const getImageBtn = document.querySelector("#getImage");
const imageContainer = document.querySelector(".images");
const loader = document.querySelector(".loader");
const theme = document.querySelector("#theme");
const downloadAll = document.querySelector("#downloadAll");
let images = [];
let timer;

downloadAll?.addEventListener("click", () => {
  images.forEach((element) => {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = element;
    a.download = "todo-1.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
});
// const theme switch
theme?.addEventListener("click", () => {
  document?.body.classList.toggle("dark-theme");
});

// inject script into browser
getImageBtn?.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting
    .executeScript({
      target: { tabId: tab.id },
      function: getImageData,
    })
    .then((injectionResults) => {
      imageContainer.innerHTML = "";
      const result = injectionResults[0].result;
      for (let i = 0; i < result.length; i++) {
        if (result.length > 0) {
          images.push(result[i]);
          images.length > 0
            ? (downloadAll.disabled = false)
            : (downloadAll.disabled = true);
          appendImages(result[i]);
          getSize(); 
        } else {
          imageContainer.innerHTML = "No images found";
        }
      }
     
      downloadImage();
    })
    .catch((err) => {
      imageContainer.innerHTML = `<h1 style='grid-column: 1/3; text-align: center'>Extension can't fetch images from this tab.</h1>`;
      console.log(err);
    });
});

// get image from browser
function getImageData() {
  let images = [];
  document.querySelectorAll("img").forEach((element) => {
    images.push(element.src);
  });
  images = new Set(images);
  images = Array.from(images);
  return images;
}
function appendImages(image) {
  const imageHolder = document.createElement("div");
  imageHolder.classList.add("image-holder");
  const input = document.createElement("input");
  input.type = "checkbox";
  const openBtn = document.createElement("button");
  openBtn.innerText = "Open";
  openBtn.title = "Open image in new tab";
  const imgWrapper = document.createElement("div");
  imgWrapper.classList.add("image-wrapper");
  const img = document.createElement("img");
  img.src = image;
  img.alt = image.slice(image.lastIndexOf("/") + 1);
  img.title = image.slice(image.lastIndexOf("/") + 1);
  let fileDetails = document.createElement("div");
  let fileExtension = image.slice(image.lastIndexOf(".") + 1,image.lastIndexOf(".") + 5);
  fileDetails.innerHTML = `<p>size:<span class="size"></span>  type= ${fileExtension} </p>`;
  imageHolder.appendChild(openBtn);
  imageHolder.appendChild(input);
  imageHolder.appendChild(fileDetails);
  imageHolder.appendChild(imgWrapper);
  imgWrapper.appendChild(img);
  imageContainer.appendChild(imageHolder);
  // run extra function
  openBtn.addEventListener("click", () => {
    chrome.tabs.create({ url: image });
  });
}
function downloadImage() {
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("click", () => {
      downloadFile(img);
    });
  });
}
function downloadFile(img) {
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = img.src;
  a.download = img.src;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
function getSize() {
  const size = document.querySelectorAll(".images .size");
  const images = document.querySelectorAll(".images img");
  for (let i = 0; i < images.length; i++) {
    let width = images[i].naturalWidth;
    let height = images[i].naturalHeight;
    size[i].innerHTML = `${width}x${height}`;
  }
}
getSize();