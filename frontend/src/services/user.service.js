import http from "../http-common";

function getUserBoard() {
    return http.get("/userBoard");
}

export default {
    getUserBoard: getUserBoard
};