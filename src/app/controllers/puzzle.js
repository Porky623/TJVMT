

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
        title: 'PUZZLE: Sesame Sojourns',
    };
    res.render('puzzle_sesame');
};

exports.load_madness = async(req,res) => {
    res.locals.metaTags = {
        title: 'PUZZLE: Mechanical Madness',
    };
    res.render('puzzle_madness');
};

exports.load_picture = async(req,res) => {
    res.locals.metaTags = {
        title: 'PUZZLE: Picture Imperfect',
    };
    res.render('puzzle_picture');
};

exports.load_schoolhouse = async(req,res) => {
    res.locals.metaTags = {
        title: 'PUZZLE: Schoolhouse Rock',
    };
    res.render('puzzle_schoolhouse');
};

exports.load_redwhiteblue = async(req,res) => {
    res.locals.metaTags = {
        title: 'PUZZLE: Red, White, and Blue',
    };
    res.render('puzzle_redwhiteblue');
};

exports.load_rings = async(req,res) => {
    res.locals.metaTags = {
        title: 'Deltopolis',
    };
    res.render('puzzle_rings');
};

exports.load_deltameta = async(req,res) => {
    res.locals.metaTags = {
        title: 'METAPUZZLE: Deltopolis',
    };
    res.render('puzzle_deltmeta');
};

exports.load_vacation = async(req,res) => {
    res.locals.metaTags = {
        title: 'PUZZLE: Vacation Season',
    };
    res.render('puzzle_vacation');
};

exports.load_wordsearch = async(req,res) => {
    res.locals.metaTags = {
        title: 'PUZZLE: The Beginning Begins',
    };
    res.render('puzzle_wordsearch');
};

exports.load_gallery = async(req,res) => {
    res.locals.metaTags = {
        title: 'PUZZLE: Spot the Difference',
    };
    res.render('puzzle_gallery');
};

exports.load_conclusions = async(req,res) => {
    res.locals.metaTags = {
        title: 'PUZZLE: Drawing Conclusions',
    };
    res.render('puzzle_conclusions');
};

exports.load_primary = async(req,res) => {
    res.locals.metaTags = {
        title: 'PUZZLE: Primary',
    };
    res.render('puzzle_primary');
};

exports.load_initiative = async(req,res) => {
    res.locals.metaTags = {
        title: 'PUZZLE: Rolling Initiative',
    };
    res.render('puzzle_initiative');
};

exports.load_final = async(req,res) => {
    res.locals.metaTags = {
        title: 'Capital',
    };
    res.render('puzzle_final');
};