

exports.load_puzzle = async(req,res) => {
    res.locals.metaTags = {
        title: 'Puzzle Hunt',
    };
    res.render('puzzle');
};

exports.load_rules = async(req,res) => {
    res.locals.metaTags = {
        title: 'Puzzle Hunt Rules',
    };
    res.render('puzzle_rules');
};

exports.load_map = async(req,res) => {
    res.locals.metaTags = {
        title: 'Mathematica',
    };
    res.render('puzzle_map');
};