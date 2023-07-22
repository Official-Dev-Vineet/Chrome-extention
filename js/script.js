document.querySelectorAll("img").forEach((element) => {
  element.addEventListener("click", () => {
    const blob = element.src;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    // the filename you want
    a.download = "todo-1.json";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    // or you know, something with better UX...
    alert("your file has downloaded!");
  });
});
