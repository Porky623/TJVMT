var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function ContestTable(_ref) {
    var _ref$scores = _ref.scores,
        scores = _ref$scores === undefined ? [] : _ref$scores;

    return React.createElement(
        "table",
        { className: "mb-4 border-collapse" },
        React.createElement(
            "thead",
            { className: "bg-gray-200" },
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    { className: "p-1 border text-center" },
                    "Rank"
                ),
                React.createElement(
                    "th",
                    { className: "p-1 border text-center" },
                    "ION ID"
                ),
                React.createElement(
                    "th",
                    { className: "p-1 border text-center" },
                    "Index"
                )
            )
        ),
        React.createElement(
            "tbody",
            null,
            scores.map(function (score, i) {
                return React.createElement(
                    "tr",
                    { key: i },
                    React.createElement(
                        "td",
                        { className: "px-2 md:px-10 py-1 border text-center font-bold" },
                        i + 1
                    ),
                    React.createElement(
                        "td",
                        { className: "px-2 md:px-10 py-1 border text-center" },
                        score.userIonUsername
                    ),
                    React.createElement(
                        "td",
                        { className: "px-2 md:px-10 py-1 border text-center" },
                        score.index.toFixed(3)
                    )
                );
            })
        )
    );
}

function TstTable(_ref2) {
    var _ref2$scores = _ref2.scores,
        scores = _ref2$scores === undefined ? [] : _ref2$scores;

    return React.createElement(
        "table",
        { className: "mb-4 border-collapse" },
        React.createElement(
            "thead",
            { className: "bg-gray-200" },
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    { className: "p-1 border text-center" },
                    "Rank"
                ),
                React.createElement(
                    "th",
                    { className: "p-1 border text-center" },
                    "ION ID"
                ),
                React.createElement(
                    "th",
                    { className: "p-1 border text-center" },
                    "Index"
                ),
                React.createElement(
                    "th",
                    { className: "p-1 border text-center" },
                    "Score Distribution"
                )
            )
        ),
        React.createElement(
            "tbody",
            null,
            scores.map(function (score, i) {
                return React.createElement(
                    "tr",
                    { key: i },
                    React.createElement(
                        "td",
                        { className: "px-2 md:px-10 py-1 border text-center font-bold" },
                        i + 1
                    ),
                    React.createElement(
                        "td",
                        { className: "px-2 md:px-10 py-1 border text-center" },
                        score.userIonUsername
                    ),
                    React.createElement(
                        "td",
                        { className: "px-2 md:px-10 py-1 border text-center" },
                        score.index.toFixed(3)
                    ),
                    React.createElement(
                        "td",
                        { className: "px-2 md:px-10 py-1 border text-center" },
                        score.correct.join('')
                    )
                );
            })
        )
    );
}

function ChooseRankingsForm(_ref3) {
    var _ref3$tsts = _ref3.tsts,
        tsts = _ref3$tsts === undefined ? [] : _ref3$tsts,
        _ref3$contests = _ref3.contests,
        contests = _ref3$contests === undefined ? [] : _ref3$contests,
        _ref3$activeRankings = _ref3.activeRankings,
        activeRankings = _ref3$activeRankings === undefined ? { type: "" } : _ref3$activeRankings,
        _ref3$setActiveRankin = _ref3.setActiveRankings,
        setActiveRankings = _ref3$setActiveRankin === undefined ? function (f) {
        return f;
    } : _ref3$setActiveRankin;

    var _React$useState = React.useState(activeRankings.type === "tst" ? activeRankings.tst : ""),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        selectedTst = _React$useState2[0],
        setSelectedTst = _React$useState2[1];

    var _React$useState3 = React.useState(activeRankings.type = "contest" ? activeRankings.contest : ""),
        _React$useState4 = _slicedToArray(_React$useState3, 2),
        selectedContest = _React$useState4[0],
        setSelectedContest = _React$useState4[1];

    return React.createElement(
        "form",
        { className: "border my-2 p-4 w-56", onSubmit: function onSubmit(e) {
                e.preventDefault();return false;
            } },
        React.createElement(
            "fieldset",
            { className: "flex flex-col" },
            React.createElement(
                "legend",
                { className: "mb-1 text-sm" },
                "TST"
            ),
            React.createElement(
                "select",
                {
                    value: selectedTst,
                    className: "p-1 bg-gray-100 focus:bg-gray-200",
                    onChange: function onChange(e) {
                        setSelectedTst(e.target.value);
                        setSelectedContest("");
                        setActiveRankings({ type: "tst", data: e.target.value });
                    }
                },
                React.createElement("option", { value: "" }),
                tsts.map(function (tst, i) {
                    return React.createElement(
                        "option",
                        { key: i, value: tst.name },
                        tst.name
                    );
                })
            )
        ),
        React.createElement(
            "fieldset",
            { className: "flex flex-col" },
            React.createElement(
                "legend",
                { className: "mb-1 text-sm" },
                "Contest"
            ),
            React.createElement(
                "select",
                {
                    value: selectedContest,
                    className: "p-1 bg-gray-100 focus:bg-gray-200",
                    onChange: function onChange(e) {
                        setSelectedTst("");
                        setSelectedContest(e.target.value);
                        setActiveRankings({ type: "contest", data: e.target.value });
                    }
                },
                React.createElement("option", { value: "" }),
                contests.map(function (contest, i) {
                    return React.createElement(
                        "option",
                        { key: i, value: contest.name + "_" + contest.year },
                        contest.name,
                        " - ",
                        contest.year
                    );
                })
            )
        )
    );
}

// const sitePrefix = "http://localhost:3000";
var sitePrefix = "https://activities.tjhsst.edu/vmt/";

function RankingsPage() {
    var _React$useState5 = React.useState(false),
        _React$useState6 = _slicedToArray(_React$useState5, 2),
        loading = _React$useState6[0],
        setLoading = _React$useState6[1];

    var _React$useState7 = React.useState(),
        _React$useState8 = _slicedToArray(_React$useState7, 2),
        error = _React$useState8[0],
        setError = _React$useState8[1];

    var _React$useState9 = React.useState([]),
        _React$useState10 = _slicedToArray(_React$useState9, 2),
        tsts = _React$useState10[0],
        setTsts = _React$useState10[1];

    var _React$useState11 = React.useState([]),
        _React$useState12 = _slicedToArray(_React$useState11, 2),
        contests = _React$useState12[0],
        setContests = _React$useState12[1];

    var _React$useState13 = React.useState([]),
        _React$useState14 = _slicedToArray(_React$useState13, 2),
        scores = _React$useState14[0],
        setScores = _React$useState14[1];

    var _React$useState15 = React.useState({ type: "" }),
        _React$useState16 = _slicedToArray(_React$useState15, 2),
        activeRankings = _React$useState16[0],
        setActiveRankings = _React$useState16[1];

    React.useEffect(function () {
        setLoading(true);
        fetch(sitePrefix + "/officer/tst", { method: "GET" }).then(function (tstData) {
            return tstData.json();
        }).then(function (tstData) {
            return setTsts(tstData.tsts);
        }).then(function () {
            return setLoading(false);
        }).catch(setError);
    }, []);

    React.useEffect(function () {
        setLoading(true);
        fetch(sitePrefix + "/officer/contest", { method: "GET" }).then(function (contestData) {
            return contestData.json();
        }).then(function (contestData) {
            return setContests(contestData.contests);
        }).then(function () {
            return setLoading(false);
        }).catch(setError);
    }, []);

    React.useEffect(function () {
        setLoading(true);
        fetch(sitePrefix + "/officer/score", { method: "GET" }).then(function (scoreData) {
            return scoreData.json();
        }).then(function (scoreData) {
            return setScores(scoreData.scores);
        }).then(function () {
            return setLoading(false);
        }).catch(setError);
    }, []);

    if (loading) return React.createElement(
        "p",
        null,
        "Loading"
    );
    if (error) return React.createElement(
        "pre",
        null,
        JSON.stringify(error, null, 4)
    );

    var rankingsElement = void 0;
    if (!activeRankings.type || !activeRankings.data) {
        rankingsElement = React.createElement(
            "p",
            { className: "text-center" },
            "Rankings shown here"
        );
    } else if (activeRankings.type === "tst") {
        var displayScores = scores.filter(function (score) {
            return score.tst === activeRankings.data;
        }).sort(function (a, b) {
            return b.index - a.index;
        });
        rankingsElement = React.createElement(TstTable, { scores: displayScores });
    } else if (activeRankings.type === "contest") {
        var getWeighting = function getWeighting(tstName) {
            console.log(activeRankings.data.split(" ")[0]);
            var curContest = contests.find(function (contest) {
                return contest.name === activeRankings.data.split("_")[0];
            });
            var tstInfo = curContest.tsts.find(function (tstInfo) {
                return tstInfo.name === tstName;
            });
            if (tstInfo) return tstInfo.weighting;else return -1;
        };
        var indexDict = {};
        scores.map(function (score) {
            var weighting = getWeighting(score.tst);
            if (weighting >= 0) indexDict[score.userIonUsername] = (score.userIonUsername in indexDict ? indexDict[score.userIonUsername] : 0) + score.index * weighting;
        });
        var _displayScores = Object.entries(indexDict).map(function (_ref4) {
            var _ref5 = _slicedToArray(_ref4, 2),
                key = _ref5[0],
                value = _ref5[1];

            return { userIonUsername: key, index: value };
        });
        rankingsElement = React.createElement(ContestTable, { scores: _displayScores });
    }

    return React.createElement(
        "div",
        { className: "flex flex-col items-center" },
        React.createElement(ChooseRankingsForm, {
            tsts: tsts,
            contests: contests,
            activeRankings: activeRankings,
            setActiveRankings: setActiveRankings }),
        rankingsElement
    );
}

ReactDOM.render(React.createElement(RankingsPage, null), document.getElementById("react-container"));