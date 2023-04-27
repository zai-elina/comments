import { format } from "date-fns";

export const renderComments = (comments) => {
  return comments
    .map((item, index) => {
      return `<li class="comment" data-index='${index}'>
            <div class="comment-header">
              <div>${item.name}</div>
              <div>${format(item.date, "yyyy-mm-dd hh.mm.ss")}</div>
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
