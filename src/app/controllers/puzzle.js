

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

exports.load_map = function(req,res) {
    res.locals.metaTags = {
        title: 'Main Map',
    };
    res.render('puzzle_map');
};

exports.load_tree = async(req,res) => {
    res.locals.metaTags = {
        title: 'Abstracton',
    };
    res.render('puzzle_tree');
};

exports.load_abstractmeta = async(req,res) => {
    res.locals.metaTags = {
        title: 'METAPUZZLE: Abstracton',
    };
    res.render('puzzle_abstractmeta');
};

exports.load_genome = async(req,res) => {
    res.locals.metaTags = {
        title: 'PUZZLE: Johnway\'s Genome',
    };
    res.render('puzzle_genome');
};

exports.load_supremelaw = async(req,res) => {
    res.locals.metaTags = {
        title: 'PUZZLE: The Supreme Law of the Land',
    };
    res.render('puzzle_supremelaw');
};

exports.load_sesame = async(req,res) => {
    res.locals.metaTags = {
        title: 'PUZZLE: Sesame\'s Travels',
    };
    res.render('puzzle_sesame');
};

exports.load_rings = async(req,res) => {
    res.locals.metaTags = {
        title: 'Deltopolis',
    };
    res.render('puzzle_rings');
};

exports.load_final = async(req,res) => {
    res.locals.metaTags = {
        title: 'Capital',
    };
    res.render('puzzle_final');
};
