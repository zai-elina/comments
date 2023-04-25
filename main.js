import { addComment, getComments, addLike } from "./api.js";
import { renderComments } from "./components/comments-component.js";
import { renderLoginComponent, name } from "./components/login-component.js";

let comments = [];

let token = null;

let isLoadingComments = true;
let isLoadingAdd = false;

// Функция для проставления лайков
const likeComment = (comments) => {
  const likesButton = document.querySelectorAll(".like-button");

  for (const item of likesButton) {
    item.addEventListener("click", (event) => {
      event.stopPropagation();
      const id = item.dataset.id;
      const index = item.dataset.index;

      comments[index].isLikeLoading = true;
      renderApp(isLoadingComments);

      addLike({
        token,
        id,
      }).then((responseData) => {
        comments[index].likes = responseData.result.likes;
        comments[index].isLiked = responseData.result.isLiked;
        comments[index].isLikeLoading = false;
        renderApp(isLoadingComments);
      });
    });
  }
};

//Ответ на комментрарий
const replyToComment = (comments) => {
  const commentElements = document.querySelectorAll(".comment");
  const textareaText = document.querySelector(".add-form-text");

  for (const commentElement of commentElements) {
    commentElement.addEventListener("click", () => {
      const index = commentElement.dataset.index;
      textareaText.value = `QUOTE_BEGIN ${comments[index].name}:\n${comments[index].text} QUOTE_END`;
    });
  }
};

//Рендеринг формы
const renderForm = (isLoading) => {
  const formWindow = document.querySelector(".add-form");
  const loaderText = document.getElementById("loader");

  if (isLoading) {
    loaderText.classList.remove("hidden");
    formWindow.classList.add("hidden");
  } else {
    loaderText.classList.add("hidden");
    formWindow.classList.remove("hidden");
  }
};

//Рендеринг приложения
const renderApp = (isLoadingComments) => {
  const appEl = document.getElementById("app");

  if (localStorage.getItem("tokenLocal")) {
    token = localStorage.getItem("tokenLocal");
  }

  const commentsHTML = renderComments(comments);

  if (!token) {
    const appHtml = `
                    <ul class="comments">
                            ${
                              isLoadingComments
                                ? "<p>Пожалуйста подождите, комментарии загружаются...</p>"
                                : ""
                            }
                            ${commentsHTML}
                        </ul>
                        <p>Чтобы добавить комментарий, <button class="to-login-button">авторизуйтесь</button></p>
                    `;

    appEl.innerHTML = appHtml;
    document.querySelector(".to-login-button").addEventListener("click", () => {
      renderLoginComponent({
        appEl,
        setToken: (newToken) => {
          token = newToken;
        },
        fetchCommentsAndRender,
      });
    });

    return;
  }

  localStorage.setItem("tokenLocal", token);

  const appHtml = `
                <ul class="comments">
                        ${
                          isLoadingComments
                            ? "<p>Пожалуйста подождите, комментарии загружаются...</p>"
                            : ""
                        }
                        ${commentsHTML}
                    </ul>
                    <div class="add-form">
                        <input
                        type="text"
                        class="add-form-name"
                        placeholder="Введите ваше имя"
                        oninput=""
                        />
                        <textarea
                        type="textarea"
                        class="add-form-text"
                        placeholder="Введите ваш коментарий"
                        rows="4"
                        oninput=""
                        ></textarea>
                        <div class="add-form-row">
                        <button class="add-form-button">Написать</button>
                        </div>
                    </div>

                    <div class="loader-comment-add hidden" id="loader">
                        Комментарий добавляется...
                    </div>
                `;

  appEl.innerHTML = appHtml;

  const buttonAddComment = document.querySelector(".add-form-button");
  const userName = document.querySelector(".add-form-name");
  const userСomment = document.querySelector(".add-form-text");
  buttonAddComment.disabled = true;

  userName.value = name ?? localStorage.getItem("nameLocal");
  userName.disabled = true;

  //Включение некликабельности кнопки при отсутствии имени
  userСomment.addEventListener("input", () => {
    buttonAddComment.disabled = false;
  });

  // Обработчик события добавление комментария
  buttonAddComment.addEventListener("click", () => {
    userСomment.classList.remove("error");

    if (userСomment.value == "") {
      userСomment.classList.add("error");
      return;
    }
    isLoadingAdd = true;
    renderForm(isLoadingAdd);

    addComment({
      text: userСomment.value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;"),
      token,
    })
      .then(() => {
        return fetchCommentsAndRender();
      })
      .then(() => {
        isLoadingAdd = false;
        renderForm(isLoadingAdd);
        userСomment.value = "";
        buttonAddComment.disabled = true;
      })
      .catch((error) => {
        isLoadingAdd = false;

        renderForm(isLoadingAdd);
        alert(error.message);
      });
  });

  likeComment(comments);
  // editComment();
  replyToComment(comments);
};

const fetchCommentsAndRender = () => {
  renderApp(isLoadingComments);
  return getComments({ token })
    .then((responseData) => {
      const appComments = responseData.comments.map((comment) => {
        return {
          name: comment.author.name,
          date: new Date(comment.date),
          text: comment.text,
          likes: comment.likes,
          isLiked: comment.isLiked,
          isLikeLoading: false,
          id: comment.id,
        };
      });
      comments = appComments;
      isLoadingComments = false;
      renderApp(isLoadingComments);
    })
    .catch((error) => {
      alert(error.message);
    });
};

fetchCommentsAndRender();
// localStorage.clear()
// token = null;
