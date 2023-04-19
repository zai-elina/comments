import { addComment, getComments } from "./api.js";
import { renderLoginComponent, name } from "./components/login-component.js";

let comments = [];

let token;

let isLoadingComments = true;
let isLoadingAdd = false;

function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}
// Функция для проставления лайков
const likeComment = (comments) => {
  const likesButton = document.querySelectorAll(".like-button");
  const counter = document.querySelectorAll(".likes-counter");

  for (const item of likesButton) {
    item.addEventListener("click", (event) => {
      event.stopPropagation();
      const index = item.dataset.index;

      comments[index].isLikeLoading = true;
      renderApp();
      delay(2000).then(() => {
        comments[index].likes = comments[index].isLiked
          ? comments[index].likes - 1
          : comments[index].likes + 1;
        comments[index].isLiked = !comments[index].isLiked;
        comments[index].isLikeLoading = false;
        renderApp();
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

function formatDate(time) {
  if (time < 10) {
    time = "0" + time;
  }
  return time;
}

function getData(date) {
  return `${date.getDate()}.${formatDate(date.getMonth() + 1)}.${String(
    date.getFullYear()
  ).slice(2)} ${formatDate(date.getHours())}:${formatDate(date.getMinutes())}`;
}

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

const renderApp = (isLoadingComments) => {
  const appEl = document.getElementById("app");

  const commentsHTML = comments
    .map((item, index) => {
      return `<li class="comment" data-index='${index}'>
            <div class="comment-header">
              <div>${item.name}</div>
              <div>${getData(item.date)}</div>
            </div>
            <div class="comment-body">
              <div class="comment-text">
                ${item.text
                  .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
                  .replaceAll("QUOTE_END", "</div>")}
              </div>
            </div>
            <div class="comment-footer">
              <!--<button class="edit-button">Редактировать</button> -->
              <div class="likes">
                <span class="likes-counter">${item.likes}</span>
                <button data-index='${index}' class="like-button ${
        item.isLiked ? "-active-like" : ""
      } ${item.isLikeLoading ? "-loading-like" : ""}"></button>
              </div>
            </div>
          </li>`;
    })
    .join("");

  if (localStorage.getItem("tokenLocal")) {
    token = localStorage.getItem("tokenLocal");
  }

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

    // addComment({ text, token, isLoading });
    // handlePostClick(comments,isLoading);
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

fetchCommentsAndRender();
// localStorage.clear();
