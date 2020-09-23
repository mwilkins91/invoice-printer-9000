import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const addPart = () => {
  const part_list = document.getElementById("part-list");
  const num = part_list.children.length;
  part_list.insertAdjacentHTML(
    "beforeend",
    `
  <li class="flex">
    <p>${num + 1}</p>
    <p class="third-width content_editable" contentEditable="true"></p>
    <p class="third-width content_editable" contentEditable="true"></p>
    <p class="third-width content_editable" contentEditable="true"></p>
  </li>
  `
  );
};

const removePart = () => {
  const part_list = document.getElementById("part-list");
  const last_child = part_list.children[part_list.children.length - 1];
  part_list.removeChild(last_child);
};

const download = () => {
  const quality = 2;
  const filename = "Invoice.pdf";
  document.body.classList.add("printing");

  requestAnimationFrame(() => {
    html2canvas(document.querySelector("body"), {
      scale: quality,
    })
      .then((canvas) => {
        let pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 211, 298);
        pdf.save(filename);
        document.body.classList.remove("printing");
      })
      .catch((err) => {
        console.error(err);
        alert("something broke, sorry!");
      });
  });
};

const handleSubTotalChange = (hstInput, totalInput) => (e) => {
  try {
    hstInput.textContent = e.target.textContent * 0.13;
    totalInput.textContent =
      Number(e.target.textContent) + Number(hstInput.textContent);
  } catch (err) {
    console.error(err);
  }
};

const main = () => {
  const addBttn = document.getElementById("add_part");
  const subBttn = document.getElementById("sub_part");
  const dwnldBttn = document.getElementById("download");

  addBttn.addEventListener("click", addPart);
  subBttn.addEventListener("click", removePart);
  dwnldBttn.addEventListener("click", download);

  const hstInput = document.getElementById("Hst_result");
  const subTotalInput = document.getElementById("Sub Total_result");
  const totalInput = document.getElementById("Total_result");

  subTotalInput.addEventListener(
    "keyup",
    handleSubTotalChange(hstInput, totalInput)
  );
};

if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  main();
} else {
  document.addEventListener("DOMContentLoaded", main);
}
