export const info = async (req, res) => {
    console.log(req.user);
    res.status(401).json({ user: req.user });
};
