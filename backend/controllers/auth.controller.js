const signup=async (req, res) => {
    res.send('sign up route');
};

const login=async (req, res) => {
    res.send('login route');
}

const logout=async (req, res) => {
    res.send('logout route');
}

module.exports={
    signup,
    login,
    logout
}