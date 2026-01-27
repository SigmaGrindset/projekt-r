
function openModal(id) {
  document.getElementById(id).style.display = "block";
}
function closeModal(id) {
  document.getElementById(id).style.display = "none";
}
function switchModal(from, to) {
  closeModal(from);
  openModal(to);
}
// window.onclick = function (event) {
//   if (event.target.classList.contains("modal")) {
//     event.target.style.display = "none";
//   }
// };
