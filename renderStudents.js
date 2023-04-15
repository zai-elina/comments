const listComments = document.querySelector(".comments");

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
      renderComments(comments);
      delay(2000).then(() => {
        comments[index].likes = comments[index].isLiked
          ? comments[index].likes - 1
          : comments[index].likes + 1;
        comments[index].isLiked = !comments[index].isLiked;
        comments[index].isLikeLoading = false;
        renderComments(comments);
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

// Рендеринг комментраиев
const renderComments = (comments) => {
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

  listComments.innerHTML = commentsHTML;
  likeComment(comments);
  // editComment();
  replyToComment(comments);
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

export { listComments, renderComments, renderForm };
