exports.load_puzzle = async(req,res) => {
    res.locals.metaTags = {
        title: 'Puzzle Hunt',
    };
    res.render('puzzle');
};export

