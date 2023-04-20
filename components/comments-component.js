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

export const renderComments = (comments) => {
  return comments
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
                <button data-id='${
                  item.id
                }' data-index="${index}" class="like-button ${
        item.isLiked ? "-active-like" : ""
      } ${item.isLikeLoading ? "-loading-like" : ""}"></button>
              </div>
            </div>
          </li>`;
    })
    .join("");
};
