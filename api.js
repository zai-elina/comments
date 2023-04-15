import { renderComments,renderForm } from "./renderStudents.js";

const buttonAddComment = document.querySelector(".add-form-button");

//Получаем данные с сервера
function fetchGetData(comments) {
  return fetch("https://webdev-hw-api.vercel.app/api/v1/zainullina/comments", {
    method: "GET",
  })
    .then((response) => {
      if (response.status === 500) {
        throw new Error("Сервер сломался, попробуй позже");
      }
      return response.json();
    })
    .then((responseData) => {
      const appComments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: new Date(comment.date),
          text: comment.text,
          likes: comment.likes,
          isLiked: false,
          isLikeLoading: false,
        };
      });
      comments = appComments;
      renderComments(comments);
    })
    .catch((error) => {
      if (error.message === "Сервер сломался, попробуй позже") {
        alert("Сервер сломался, попробуй позже");
      } else {
        alert("Кажется, у вас сломался интернет, попробуйте позже");
      }
    });
}

//Добавление комментраия на сервер
const handlePostClick = (comments,isLoading) => {
  fetch("https://webdev-hw-api.vercel.app/api/v1/zainullina/comments", {
    method: "POST",
    body: JSON.stringify({
      text: userСomment.value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;"),
      name: userName.value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;"),
      // forceError: true,
    }),
  })
    .then((response) => {
      if (response.status === 400) {
        throw new Error("Имя и комментарий должны быть не короче 3 символов");
      }
      if (response.status === 500) {
        throw new Error("Сервер сломался, попробуй позже");
      }
      return response.json();
    })
    .then((responseData) => {
      return fetchGetData(comments);
    })
    .then(() => {
      isLoading = false;
      renderForm(isLoading);
      userСomment.value = "";
      userName.value = "";
      buttonAddComment.disabled = true;
    })
    .catch((error) => {
      isLoading = false;

      renderForm(isLoading);
      if (
        error.message === "Имя и комментарий должны быть не короче 3 символов"
      ) {
        alert("Имя и комментарий должны быть не короче 3 символов");
      } else if (error.message === "Сервер сломался, попробуй позже") {
        alert("Сервер сломался, попробуй позже");
        handlePostClick(comments,isLoading);
      } else {
        console.log(error);
        alert("Кажется, у вас сломался интернет, попробуйте позже");
      }
    });
};

export { fetchGetData, handlePostClick};
