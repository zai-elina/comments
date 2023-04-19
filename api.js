const host = "https://webdev-hw-api.vercel.app/api/v2/zai-elina/comments";

export function getComments({ token }) {
  return fetch(host, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("Нет авторизации");
    }
    if (response.status === 500) {
      throw new Error("Сервер сломался, попробуй позже");
    }
    return response.json();
  });
}

export function addComment({ text, token }) {
  return fetch(host, {
    method: "POST",
    body: JSON.stringify({
      text,
    }),
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 400) {
        throw new Error("Комментарий должен быть не короче 3 символов");
      }
      if (response.status === 500) {
        throw new Error("Сервер сломался, попробуй позже");
      }
    return response.json();
  });
}

export function addLike({ token, id }) {
  return fetch(host+`/${id}/`+'toggle-like', {
    method: "POST",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    return response.json();
  });
}



export function loginUser({ login, password }) {
  return fetch("https://webdev-hw-api.vercel.app/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if(response.status === 400){
        throw new Error('Неверный логин или пароль');
    }
    return response.json();
  });
}

export function registerUser({ login, password,name }) {
    return fetch("https://webdev-hw-api.vercel.app/api/user", {
      method: "POST",
      body: JSON.stringify({
        login,
        password,
        name
      }),
    }).then((response) => {
      if(response.status === 400){
          throw new Error('Такой пользователь уже существует');
      }
      return response.json();
    });
  }


