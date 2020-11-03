

const authHeader = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if(user.token){
        return {Authorization: `Bearer ${user.token}`};
    }else{
        return {};
    }
}

module.exports = { authHeader };