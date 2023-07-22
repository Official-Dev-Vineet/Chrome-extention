const getImageBtn = document.querySelector("#getImage");
const imageContainer = document.querySelector(".images");
const loader = document.querySelector(".loader");
const theme = document.querySelector("#theme");
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
      loader.style = "display:flex";
      imageContainer.innerHTML = "";
      for (const { result } of injectionResults) {
        console.log(result);
        if (result.length > 0) {
          result.forEach((element, index) => {
            const img = document.createElement("img");
            img.src = element;
            img.alt = "image" + index;
            imageContainer.appendChild(img);
          });
        } else {
          imageContainer.innerHTML = "No images found";
        }
      }
      setTimeout(() => {
        loader.style = "display:none";
      }, 1500);
      downloadImage();
    })
    .catch((err) => {
      imageContainer.innerHTML = `<h1 style='grid-column: 1/3; text-align: center'>Extension can't fetch images from this tab.</h1>`;
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
function downloadImage() {
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("click", () => {
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = img.src;
      a.download = img.alt;
      document.body.appendChild(a);
      a.click();
    });
  });
}
