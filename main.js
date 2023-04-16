import { listComments,renderForm } from "./renderStudents.js";
import { fetchGetData,handlePostClick } from "./api.js";

const buttonAddComment = document.querySelector(".add-form-button");
const userName = document.querySelector(".add-form-name");
const userСomment = document.querySelector(".add-form-text");
buttonAddComment.disabled = true;
let comments = [];
let isLoading = false;

listComments.textContent = "Пожалуйста подождите, комментарии загружаются...";
fetchGetData(comments);


//Функция изменения комментария
// const editComment = () => {
//   const editButtons = document.querySelectorAll(".edit-button");
//   const commentText = document.querySelectorAll(".comment-text");
//   for (const editButton of editButtons) {
//     let isEdit = false;

//     editButton.addEventListener("click", (event) => {
//       event.stopPropagation();
//       const index = editButton.dataset.index;

//       if (!isEdit) {
//         commentText[index].innerHTML = `<textarea
//       type="textarea"
//       id="edit-text"
//       rows="4" style="width:500px"
//     >${commentText[index].innerText}</textarea>`;
//         editButton.innerText = "Сохранить";
//       } else {
//         const newText = document.getElementById("edit-text");
//         comments[index].text = newText.value;
//         renderComments();
//       }

//       isEdit = !isEdit;
//     });
//   }
// };



// Добавление новых комментариев
function addComment() {
  userName.classList.remove("error");

  if (userName.value == "") {
    userName.classList.add("error");
    return;
  }

  userСomment.classList.remove("error");

  if (userСomment.value == "") {
    userСomment.classList.add("error");
    return;
  }
  isLoading = true;
  renderForm(isLoading);

  handlePostClick(comments,isLoading);
}

//Включение некликабельности кнопки при отсутствии имени
userName.addEventListener("input", () => {
  buttonAddComment.disabled = false;
});

// Обработчик события добавление комментария
buttonAddComment.addEventListener("click", () => {
  addComment();
});

// Обработчик события добавление комментария по нажатию enter
userСomment.addEventListener("keyup", (event) => {
  if (event.code == "Enter") {
    addComment();
  }
});

//Удаление последнего комментария
// const deleteButton = document.querySelector(".delete-comment-button");

// deleteButton.addEventListener("click", () => {
//   comments.pop();
//   renderComments();
// });
