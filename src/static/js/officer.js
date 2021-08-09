var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// const sitePrefix = "http://localhost:3000";
var sitePrefix = "https://activities.tjhsst.edu/vmt/";

var OfficerContext = React.createContext();

function OfficerProvider(_ref) {
    var children = _ref.children;

    var _React$useState = React.useState(true),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        loading = _React$useState2[0],
        setLoading = _React$useState2[1];

    var _React$useState3 = React.useState(),
        _React$useState4 = _slicedToArray(_React$useState3, 2),
        error = _React$useState4[0],
        setError = _React$useState4[1];

    var _React$useState5 = React.useState([]),
        _React$useState6 = _slicedToArray(_React$useState5, 2),
        tsts = _React$useState6[0],
        setTsts = _React$useState6[1];

    var _React$useState7 = React.useState([]),
        _React$useState8 = _slicedToArray(_React$useState7, 2),
        scores = _React$useState8[0],
        setScores = _React$useState8[1];

    var _React$useState9 = React.useState([]),
        _React$useState10 = _slicedToArray(_React$useState9, 2),
        contests = _React$useState10[0],
        setContests = _React$useState10[1];

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

    var addTst = function addTst(newTst) {
        var exists = tsts.reduce(function (acc, cur) {
            return acc ? acc : newTst.name === cur.name;
        }, false);
        if (exists) {
            alert("A TST with that name already exists. Please choose another name.");
        } else {
            fetch(sitePrefix + "/officer/tst", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newTst: newTst })
            }).then(function (res) {
                if (res.ok) return res.json();else throw new Error(res.statusText);
            }).then(function (res) {
                return setTsts([].concat(_toConsumableArray(tsts), [res.tstObj]));
            }).catch(function (err) {
                return console.log("ERROR: " + err.message);
            });
        }
    };

    var editTst = function editTst(editedTst) {
        fetch(sitePrefix + "/officer/tst", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ editedTst: editedTst })
        }).then(function (res) {
            if (res.ok) return res.json();else throw new Error(res.statusText);
        }).then(function (res) {
            var oldTst = tsts.find(function (tst) {
                return tst._id === res.editedTst._id;
            });
            setScores(scores.map(function (score) {
                return score.tst === oldTst.name ? Object.assign({}, score, { tst: res.editedTst.name }) : score;
            }));
            setTsts(tsts.map(function (tst) {
                return tst._id === res.editedTst._id ? res.editedTst : tst;
            }));
            alert("Changes to TST " + res.editedTst.name + " successfully saved.");
        }).catch(function (err) {
            return console.log("ERROR: " + err.message);
        });
    };

    var deleteTst = function deleteTst(tstId) {
        fetch(sitePrefix + "/officer/tst?tstId=" + tstId, { method: "DELETE" }).then(function (res) {
            if (res.ok) setTsts(tsts.filter(function (tst) {
                return tst._id !== tstId;
            }));else throw new Error(res.statusText);
        }).catch(function (err) {
            return console.log("ERROR: " + err.message);
        });
    };

    var addContest = function addContest(newContest) {
        var exists = contests.reduce(function (acc, cur) {
            return acc ? acc : newContest.name === cur.name;
        }, false);
        if (exists) {
            alert("A contest with that name already exists. Please choose another name.");
        } else {
            fetch(sitePrefix + "/officer/contest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newContest: newContest })
            }).then(function (res) {
                if (res.ok) return res.json();else throw new Error(res.statusText);
            }).then(function (res) {
                return setContests([].concat(_toConsumableArray(contests), [res.contestObj]));
            }).catch(function (err) {
                return console.log("ERROR: " + err.message);
            });
        }
    };

    var editContest = function editContest(editedContest) {
        fetch(sitePrefix + "/officer/contest", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ editedContest: editedContest })
        }).then(function (res) {
            if (res.ok) return res.json();else throw new Error(res.statusText);
        }).then(function (res) {
            setContests(contests.map(function (contest) {
                return contest._id === res.editedContest._id ? res.editedContest : contest;
            }));
            alert("Changes to contest " + res.editedContest.name + " successfully saved.");
        }).catch(function (err) {
            return console.log("ERROR: " + err.message);
        });
    };

    var deleteContest = function deleteContest(contestId) {
        fetch(sitePrefix + "/officer/contest?contestId=" + contestId, { method: "DELETE" }).then(function (res) {
            if (res.ok) setContests(contests.filter(function (contest) {
                return contest._id !== contestId;
            }));else throw new Error(res.statusText);
        }).catch(function (err) {
            return console.log("ERROR: " + err.message);
        });
    };

    var addScore = function addScore(newScore) {
        var exists = scores.reduce(function (acc, cur) {
            return acc ? acc : newScore.userIonUsername === cur.userIonUsername && newScore.tst === cur.tst;
        }, false);
        if (exists) {
            alert("A score for that user for that tst already exists.");
        } else {
            fetch(sitePrefix + "/officer/score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newScore: newScore })
            }).then(function (res) {
                if (res.ok) return res.json();else throw new Error(res.statusText);
            }).then(function (res) {
                return setScores([].concat(_toConsumableArray(scores), [res.scoreObj]));
            }).catch(function (err) {
                return console.log("ERROR: " + err.message);
            });
        }
    };

    var editScore = function editScore(editedScore) {
        fetch(sitePrefix + "/officer/score", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ editedScore: editedScore })
        }).then(function (res) {
            if (res.ok) return res.json();else throw new Error(res.statusText);
        }).then(function (res) {
            setScores(scores.map(function (score) {
                return score._id === res.editedScore._id ? res.editedScore : score;
            }));
            alert("Changes to " + res.editedScore.userIonUsername + "'s score for TST " + res.editedScore.tst + " successfully saved.");
        }).catch(function (err) {
            return console.log("ERROR: " + err.message);
        });
    };

    var deleteScore = function deleteScore(scoreId) {
        fetch(sitePrefix + "/officer/score?scoreId=" + scoreId, { method: "DELETE" }).then(function (res) {
            if (res.ok) setScores(scores.filter(function (score) {
                return score._id !== scoreId;
            }));else throw new Error(res.statusText);
        }).catch(function (err) {
            return console.log("ERROR: " + err.message);
        });
    };

    var updateServer = function updateServer(action) {
        if (action.target === "tst") {
            if (action.type === "add") addTst(action.data);else if (action.type === "edit") editTst(action.data);else if (action.type === "delete") deleteTst(action.data);else console.log("Invalid option. Please choose among options {add, edit, delete}");
        } else if (action.target === "contest") {
            if (action.type === "add") addContest(action.data);else if (action.type === "edit") editContest(action.data);else if (action.type === "delete") deleteContest(action.data);else console.log("Invalid option. Please choose among options {add, edit, delete}");
        } else if (action.target === "score") {
            if (action.type === "add") addScore(action.data);else if (action.type === "edit") editScore(action.data);else if (action.type === "delete") deleteScore(action.data);else console.log("Invalid option. Please choose among options {add, edit, delete}");
        }
    };

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
    return React.createElement(
        OfficerContext.Provider,
        { value: { tsts: tsts, contests: contests, scores: scores, updateServer: updateServer } },
        children
    );
}

function TagInputField(_ref2) {
    var _ref2$taglist = _ref2.taglist,
        taglist = _ref2$taglist === undefined ? [] : _ref2$taglist,
        _ref2$updateTaglist = _ref2.updateTaglist,
        updateTaglist = _ref2$updateTaglist === undefined ? function (f) {
        return f;
    } : _ref2$updateTaglist,
        _ref2$label = _ref2.label,
        label = _ref2$label === undefined ? "" : _ref2$label;

    var inputKeyDown = function inputKeyDown(e) {
        if (e.key === "Enter" && e.target.value !== "") {
            updateTaglist({ type: "add", data: e.target.value });
            e.target.value = "";
        } else if (e.key === "Backspace" && e.target.value === "") {
            updateTaglist({ type: "delete" });
        }
    };

    return React.createElement(
        "div",
        null,
        React.createElement(
            "label",
            { className: "mb-1 text-sm" },
            label
        ),
        React.createElement(
            "div",
            { className: "p-1 mb-2 text-xs bg-gray-100 focus:bg-gray-200 focus:outline-none transition duration-300 ease-in-out" },
            taglist.map(function (tag, i) {
                return React.createElement(
                    "div",
                    { key: i, className: "inline-flex flex-row mx-1 px-2 py-1 bg-gray-50 rounded-full" },
                    React.createElement(
                        "p",
                        { className: "mr-1 text-gray-700" },
                        tag
                    ),
                    React.createElement(
                        "button",
                        { type: "button", className: "text-gray-400", onClick: function onClick() {
                                return updateTaglist({ type: "delete", data: tag });
                            } },
                        "X"
                    )
                );
            }),
            React.createElement("input", { type: "text", className: "text-base w-1/2 bg-transparent focus:outline-none", onKeyDown: inputKeyDown })
        )
    );
}

function TstEditForm(_ref3) {
    var _ref3$dataEntry = _ref3.dataEntry,
        dataEntry = _ref3$dataEntry === undefined ? { _id: "", writers: [] } : _ref3$dataEntry,
        _ref3$submitAction = _ref3.submitAction,
        submitAction = _ref3$submitAction === undefined ? function (f) {
        return f;
    } : _ref3$submitAction,
        _ref3$cancelAction = _ref3.cancelAction,
        cancelAction = _ref3$cancelAction === undefined ? function (f) {
        return f;
    } : _ref3$cancelAction,
        submitText = _ref3.submitText;

    var _React$useState11 = React.useState(dataEntry._id ? dataEntry.name : ""),
        _React$useState12 = _slicedToArray(_React$useState11, 2),
        tstName = _React$useState12[0],
        setTstName = _React$useState12[1];

    var _React$useState13 = React.useState(dataEntry._id ? dataEntry.year : ""),
        _React$useState14 = _slicedToArray(_React$useState13, 2),
        year = _React$useState14[0],
        setYear = _React$useState14[1];

    var _React$useState15 = React.useState(dataEntry._id ? dataEntry.numProblems : ""),
        _React$useState16 = _slicedToArray(_React$useState15, 2),
        numProblems = _React$useState16[0],
        setNumProblems = _React$useState16[1];

    var _React$useReducer = React.useReducer(function (state) {
        return !state;
    }, dataEntry._id ? dataEntry.scoreWeighted : false),
        _React$useReducer2 = _slicedToArray(_React$useReducer, 2),
        scoreWeighted = _React$useReducer2[0],
        toggleScoreWeighted = _React$useReducer2[1];

    var _React$useReducer3 = React.useReducer(function (state, action) {
        if (action.type === "add") return [].concat(_toConsumableArray(state), [action.data]);
        if (action.type === "delete") {
            if (action.data) return state.filter(function (writer) {
                return writer !== action.data;
            });
            return state.slice(0, -1);
        }
    }, dataEntry.writers),
        _React$useReducer4 = _slicedToArray(_React$useReducer3, 2),
        writers = _React$useReducer4[0],
        updateWriters = _React$useReducer4[1];

    return React.createElement(
        "form",
        { onSubmit: function onSubmit(e) {
                e.preventDefault();return false;
            } },
        React.createElement(
            "div",
            { className: "flex flex-col mb-2" },
            React.createElement(
                "label",
                { htmlFor: "tstName", className: "mb-1 text-sm" },
                "TST Name"
            ),
            React.createElement("input", {
                name: "tstName",
                type: "text",
                value: tstName,
                className: "p-1 bg-gray-100 focus:bg-gray-200 focus:outline-none transition duration-300 ease-in-out",
                onChange: function onChange(e) {
                    return setTstName(e.target.value);
                },
                required: true
            })
        ),
        React.createElement(
            "div",
            { className: "flex flex-row justify-between mb-2" },
            React.createElement(
                "div",
                { className: "flex flex-col w-11/24" },
                React.createElement(
                    "label",
                    { htmlFor: "year", className: "mb-1 text-sm" },
                    "Year"
                ),
                React.createElement("input", {
                    name: "year",
                    type: "number",
                    value: year,
                    className: "p-1 bg-gray-100 focus:bg-gray-200 focus:outline-none transition duration-300 ease-in-out",
                    onChange: function onChange(e) {
                        return setYear(e.target.value);
                    },
                    required: true
                })
            ),
            React.createElement(
                "div",
                { className: "flex flex-col w-11/24" },
                React.createElement(
                    "label",
                    { htmlFor: "numProblems", className: "mb-1 text-sm" },
                    "Num Problems"
                ),
                React.createElement("input", {
                    name: "numProblems",
                    type: "number",
                    value: numProblems,
                    className: "p-1 bg-gray-100 focus:bg-gray-200 focus:outline-none transition duration-300 ease-in-out",
                    onChange: function onChange(e) {
                        return setNumProblems(e.target.value);
                    },
                    required: true
                })
            )
        ),
        React.createElement(
            "div",
            { className: "flex flex-row mb-2" },
            React.createElement(
                "label",
                { htmlFor: "scoreWeighted", className: "text-sm mr-2" },
                "Score Weighted"
            ),
            React.createElement("input", {
                name: "scoreWeighted",
                type: "checkbox",
                checked: scoreWeighted,
                onChange: toggleScoreWeighted
            })
        ),
        React.createElement(TagInputField, { taglist: writers, updateTaglist: updateWriters, label: "Writers" }),
        React.createElement(
            "div",
            { className: "flex flex-row justify-center" },
            React.createElement(
                "button",
                {
                    type: "button",
                    className: "mx-1 py-2 w-1/5 text-sm uppercase rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none transition duration-300 ease-in-out",
                    onClick: function onClick() {
                        return submitAction({ _id: dataEntry._id, name: tstName, year: year, numProblems: numProblems, scoreWeighted: scoreWeighted, writers: writers });
                    } },
                submitText
            ),
            React.createElement(
                "button",
                {
                    type: "button",
                    className: "mx-1 py-2 w-1/5 text-sm uppercase rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none transition duration-300 ease-in-out",
                    onClick: cancelAction },
                "Close"
            )
        )
    );
}

function ScoreEditForm(_ref4) {
    var _ref4$dataEntry = _ref4.dataEntry,
        dataEntry = _ref4$dataEntry === undefined ? { _id: "", correct: [] } : _ref4$dataEntry,
        _ref4$submitAction = _ref4.submitAction,
        submitAction = _ref4$submitAction === undefined ? function (f) {
        return f;
    } : _ref4$submitAction,
        _ref4$cancelAction = _ref4.cancelAction,
        cancelAction = _ref4$cancelAction === undefined ? function (f) {
        return f;
    } : _ref4$cancelAction,
        submitText = _ref4.submitText;

    var _React$useState17 = React.useState(dataEntry._id ? dataEntry.userIonUsername : ""),
        _React$useState18 = _slicedToArray(_React$useState17, 2),
        userIonUsername = _React$useState18[0],
        setUserIonUsername = _React$useState18[1];

    var _React$useState19 = React.useState(dataEntry._id ? dataEntry.tst : ""),
        _React$useState20 = _slicedToArray(_React$useState19, 2),
        tstName = _React$useState20[0],
        setTstName = _React$useState20[1];

    var _React$useState21 = React.useState(dataEntry._id ? dataEntry.correct : []),
        _React$useState22 = _slicedToArray(_React$useState21, 2),
        correct = _React$useState22[0],
        setCorrect = _React$useState22[1];

    var _React$useState23 = React.useState(dataEntry._id !== ""),
        _React$useState24 = _slicedToArray(_React$useState23, 1),
        userTstLocked = _React$useState24[0];

    var allTsts = React.useContext(OfficerContext).tsts;

    return React.createElement(
        "form",
        { onSubmit: function onSubmit(e) {
                e.preventDefault();return false;
            } },
        React.createElement(
            "div",
            null,
            React.createElement(
                "label",
                { htmlFor: "userIonUsername", className: "mb-1 text-sm" },
                "User Ion Username"
            ),
            React.createElement("input", {
                name: "userIonUsername",
                type: "text",
                value: userIonUsername,
                className: "p-1 bg-gray-100 focus:bg-gray-200 focus:outline-none transition duration-300 ease-in-out",
                onChange: function onChange(e) {
                    return setUserIonUsername(e.target.value);
                },
                readOnly: userTstLocked,
                required: true })
        ),
        React.createElement(
            "div",
            null,
            React.createElement(
                "label",
                { htmlFor: "tstName", className: "mb-1 text-sm" },
                "TST"
            ),
            React.createElement(
                "select",
                {
                    value: tstName,
                    onChange: function onChange(e) {
                        setTstName(e.target.value);
                        var selectedTst = allTsts.find(function (tst) {
                            return tst.name === e.target.value;
                        });

                        if (selectedTst) {
                            var newCorrect = [];
                            newCorrect.length = selectedTst.numProblems;
                            newCorrect.fill(0);
                            setCorrect(newCorrect);
                        } else setCorrect([]);
                    },
                    disabled: userTstLocked
                },
                React.createElement("option", { value: "" }),
                allTsts.map(function (tst, i) {
                    return React.createElement(
                        "option",
                        { key: i, value: tst.name },
                        tst.name
                    );
                })
            )
        ),
        tstName !== "" && React.createElement(
            "fieldset",
            null,
            React.createElement(
                "legend",
                { className: "mb-1 text-sm" },
                "Correct Answers"
            ),
            React.createElement(
                "div",
                null,
                correct.map(function (problemCorrect, i) {
                    return React.createElement(
                        "div",
                        { key: i },
                        React.createElement(
                            "label",
                            { htmlFor: "problem_" + i, className: "text-sm" },
                            i + 1,
                            "."
                        ),
                        React.createElement("input", {
                            name: "problem_" + i,
                            type: "checkbox",
                            checked: problemCorrect === 1,
                            onChange: function onChange() {
                                return setCorrect(correct.map(function (p, j) {
                                    return i === j ? (p + 1) % 2 : p;
                                }));
                            }
                        })
                    );
                })
            )
        ),
        React.createElement(
            "div",
            { className: "flex flex-row justify-center mt-2" },
            React.createElement(
                "button",
                {
                    type: "button",
                    className: "mx-1 py-2 w-1/5 text-sm uppercase rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none transition duration-300 ease-in-out",
                    onClick: function onClick() {
                        return submitAction({ _id: dataEntry._id, userIonUsername: userIonUsername, tst: tstName, correct: correct });
                    } },
                submitText
            ),
            React.createElement(
                "button",
                {
                    type: "button",
                    className: "mx-1 py-2 w-1/5 text-sm uppercase rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none transition duration-300 ease-in-out",
                    onClick: cancelAction },
                "Close"
            )
        )
    );
}

function ContestTstField(_ref5) {
    var _ref5$tsts = _ref5.tsts,
        tsts = _ref5$tsts === undefined ? [] : _ref5$tsts,
        _ref5$updateTsts = _ref5.updateTsts,
        updateTsts = _ref5$updateTsts === undefined ? function (f) {
        return f;
    } : _ref5$updateTsts;

    var _React$useState25 = React.useState(""),
        _React$useState26 = _slicedToArray(_React$useState25, 2),
        selectedTst = _React$useState26[0],
        setSelectedTst = _React$useState26[1];

    var allTsts = React.useContext(OfficerContext).tsts;

    var tstChosen = function tstChosen(tst) {
        return tsts.reduce(function (acc, curTst) {
            return acc ? acc : tst.name === curTst.name;
        }, false);
    };
    var filterTsts = function filterTsts() {
        return allTsts.filter(function (tst) {
            return !tstChosen(tst);
        });
    };

    return React.createElement(
        "fieldset",
        null,
        React.createElement(
            "legend",
            { className: "mb-1 text-sm" },
            "TSTs"
        ),
        React.createElement(
            "table",
            null,
            React.createElement(
                "thead",
                null,
                React.createElement(
                    "tr",
                    null,
                    React.createElement("th", { className: "text-xs w-1/2" }),
                    React.createElement("th", { className: "text-xs w-1/3" }),
                    React.createElement("th", { className: "text-xs w-1/6" })
                )
            ),
            React.createElement(
                "tbody",
                null,
                tsts.map(function (tst, i) {
                    return React.createElement(
                        "tr",
                        { key: i },
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "label",
                                { htmlFor: "tst_" + i },
                                tst.name
                            )
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement("input", {
                                name: "tst_" + i,
                                type: "number",
                                step: "0.01",
                                value: tst.weighting,
                                className: "p-1 w-full bg-gray-100 focus:bg-gray-200 focus:outline-none transition duration-300 ease-in-out",
                                onChange: function onChange(e) {
                                    return updateTsts({ type: "edit", data: { name: tst.name, weighting: e.target.value } });
                                }
                            })
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "button",
                                {
                                    type: "button",
                                    className: "mx-1 px-3 py-1 text-sm uppercase rounded-full bg-gray-100 focus:bg-gray-200 focus:outline-none transition duration-300 ease-in-out",
                                    onClick: function onClick() {
                                        return updateTsts({ type: "delete", data: tst.name });
                                    } },
                                "X"
                            )
                        )
                    );
                })
            )
        ),
        React.createElement(
            "button",
            {
                type: "button",
                className: "px-3 py-1 text-sm rounded-full bg-gray-100 focus:bg-gray-200 focus:outline-none transition duration-300 ease-in-out",
                onClick: function onClick() {
                    updateTsts({ type: "add", data: selectedTst });
                    setSelectedTst("");
                } },
            "Add TST"
        ),
        React.createElement(
            "select",
            { value: selectedTst, onChange: function onChange(e) {
                    return setSelectedTst(e.target.value);
                }, className: "text-sm" },
            React.createElement("option", { value: "" }),
            filterTsts().map(function (tst, i) {
                return React.createElement(
                    "option",
                    { key: i, value: tst.name },
                    tst.name
                );
            })
        )
    );
}

function ContestEditForm(_ref6) {
    var _ref6$dataEntry = _ref6.dataEntry,
        dataEntry = _ref6$dataEntry === undefined ? { _id: "", tsts: [] } : _ref6$dataEntry,
        _ref6$submitAction = _ref6.submitAction,
        submitAction = _ref6$submitAction === undefined ? function (f) {
        return f;
    } : _ref6$submitAction,
        _ref6$cancelAction = _ref6.cancelAction,
        cancelAction = _ref6$cancelAction === undefined ? function (f) {
        return f;
    } : _ref6$cancelAction,
        submitText = _ref6.submitText;

    var _React$useState27 = React.useState(dataEntry._id ? dataEntry.name : ""),
        _React$useState28 = _slicedToArray(_React$useState27, 2),
        contestName = _React$useState28[0],
        setContestName = _React$useState28[1];

    var _React$useState29 = React.useState(dataEntry._id ? dataEntry.year : ""),
        _React$useState30 = _slicedToArray(_React$useState29, 2),
        year = _React$useState30[0],
        setYear = _React$useState30[1];

    var _React$useReducer5 = React.useReducer(function (state, action) {
        if (action.type === "add") return [].concat(_toConsumableArray(state), [{ name: action.data, weighting: 0.0 }]);else if (action.type === "edit") return state.map(function (tst) {
            return tst.name === action.data.name ? { name: tst.name, weighting: action.data.weighting } : tst;
        });else if (action.type === "delete") return state.filter(function (tst) {
            return tst.name !== action.data;
        });
    }, dataEntry.tsts),
        _React$useReducer6 = _slicedToArray(_React$useReducer5, 2),
        tsts = _React$useReducer6[0],
        updateTsts = _React$useReducer6[1];

    return React.createElement(
        "form",
        { onSubmit: function onSubmit(e) {
                e.preventDefault();return false;
            } },
        React.createElement(
            "div",
            { className: "flex flex-col mb-2" },
            React.createElement(
                "label",
                { htmlFor: "contestName", className: "mb-1 text-sm" },
                "Contest Name"
            ),
            React.createElement("input", {
                name: "contestName",
                type: "text",
                value: contestName,
                className: "p-1 bg-gray-100 focus:bg-gray-200 focus:outline-none transition duration-300 ease-in-out",
                onChange: function onChange(e) {
                    return setContestName(e.target.value);
                },
                required: true
            })
        ),
        React.createElement(
            "div",
            { className: "flex flex-col mb-2" },
            React.createElement(
                "label",
                { htmlFor: "year", className: "mb-1 text-sm" },
                "Year"
            ),
            React.createElement("input", {
                name: "year",
                type: "number",
                value: year,
                className: "p-1 bg-gray-100 focus:bg-gray-200 focus:outline-none transition duration-300 ease-in-out",
                onChange: function onChange(e) {
                    return setYear(e.target.value);
                },
                required: true
            })
        ),
        React.createElement(ContestTstField, { tsts: tsts, updateTsts: updateTsts }),
        React.createElement(
            "div",
            { className: "flex flex-row justify-center mt-2" },
            React.createElement(
                "button",
                {
                    type: "button",
                    className: "mx-1 py-2 w-1/5 text-sm uppercase rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none transition duration-300 ease-in-out",
                    onClick: function onClick() {
                        return submitAction({ _id: dataEntry._id, name: contestName, year: year, tsts: tsts });
                    } },
                submitText
            ),
            React.createElement(
                "button",
                {
                    type: "button",
                    className: "mx-1 py-2 w-1/5 text-sm uppercase rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none transition duration-300 ease-in-out",
                    onClick: cancelAction },
                "Close"
            )
        )
    );
}

function DataEditTableRow(_ref7) {
    var _ref7$dataEntry = _ref7.dataEntry,
        dataEntry = _ref7$dataEntry === undefined ? {} : _ref7$dataEntry,
        _ref7$meta = _ref7.meta,
        meta = _ref7$meta === undefined ? {} : _ref7$meta,
        _ref7$editFunc = _ref7.editFunc,
        editFunc = _ref7$editFunc === undefined ? function (f) {
        return f;
    } : _ref7$editFunc,
        _ref7$deleteFunc = _ref7.deleteFunc,
        deleteFunc = _ref7$deleteFunc === undefined ? function (f) {
        return f;
    } : _ref7$deleteFunc,
        _ref7$DataEditForm = _ref7.DataEditForm,
        DataEditForm = _ref7$DataEditForm === undefined ? null : _ref7$DataEditForm;

    var _React$useState31 = React.useState(false),
        _React$useState32 = _slicedToArray(_React$useState31, 2),
        editToggled = _React$useState32[0],
        setEditToggled = _React$useState32[1];

    if (editToggled) {
        return dataEntry && React.createElement(
            "tr",
            null,
            React.createElement(
                "td",
                { colSpan: meta.columnNames.length + 1, className: "p-2 w-full" },
                React.createElement(DataEditForm, {
                    dataEntry: dataEntry,
                    submitAction: editFunc,
                    cancelAction: function cancelAction() {
                        return setEditToggled(false);
                    },
                    submitText: "Save" })
            )
        );
    } else {
        return dataEntry && React.createElement(
            "tr",
            null,
            meta.columnNames.map(function (colInfo, i) {
                return React.createElement(
                    "td",
                    { key: i, className: "px-2 py-3" },
                    dataEntry[colInfo.propName]
                );
            }),
            React.createElement(
                "td",
                null,
                React.createElement(
                    "button",
                    {
                        type: "button",
                        className: "mr-1 p-2 w-11/24 text-sm uppercase rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none transition duration-300 ease-in-out",
                        onClick: function onClick() {
                            return setEditToggled(true);
                        } },
                    "Edit"
                ),
                React.createElement(
                    "button",
                    {
                        type: "button",
                        className: "mr-1 p-2 w-11/24 text-sm uppercase rounded-full text-white bg-red-600 hover:bg-red-700 focus:outline-none transition duration-300 ease-in-out",
                        onClick: function onClick() {
                            if (confirm("Are you sure you want to delete this entry?")) deleteFunc(dataEntry._id);
                        } },
                    "Delete"
                )
            )
        );
    }
}

function DataEditTable(_ref8) {
    var _ref8$meta = _ref8.meta,
        meta = _ref8$meta === undefined ? {} : _ref8$meta,
        _ref8$filters = _ref8.filters,
        filters = _ref8$filters === undefined ? {} : _ref8$filters,
        _ref8$editFunc = _ref8.editFunc,
        editFunc = _ref8$editFunc === undefined ? function (f) {
        return f;
    } : _ref8$editFunc,
        _ref8$deleteFunc = _ref8.deleteFunc,
        deleteFunc = _ref8$deleteFunc === undefined ? function (f) {
        return f;
    } : _ref8$deleteFunc,
        _ref8$DataEditForm = _ref8.DataEditForm,
        DataEditForm = _ref8$DataEditForm === undefined ? null : _ref8$DataEditForm;

    var data = React.useContext(OfficerContext)[meta.dataTarget + "s"];
    var matchesFilters = function matchesFilters(dataEntry) {
        return filters.reduce(function (acc, filter) {
            return !acc ? acc : !filter.value || dataEntry[filter.propName] === filter.value;
        }, true);
    };

    if (data.length === 0) return React.createElement(
        "p",
        null,
        "No data."
    );
    return React.createElement(
        "table",
        { className: "my-2 w-full text-left table-fixed border border-collapse divide-y" },
        React.createElement(
            "thead",
            null,
            React.createElement(
                "tr",
                null,
                meta.columnNames.map(function (colInfo, i) {
                    return React.createElement(
                        "th",
                        { key: i, className: "p-2 w-" + colInfo.width },
                        colInfo.displayName
                    );
                }),
                React.createElement(
                    "th",
                    { className: "p-2 w-1/2" },
                    "Actions"
                )
            )
        ),
        React.createElement(
            "tbody",
            { className: "divide-y" },
            data.map(function (dataEntry, i) {
                if (matchesFilters(dataEntry)) {
                    return React.createElement(DataEditTableRow, {
                        key: i,
                        dataEntry: dataEntry,
                        meta: meta,
                        editFunc: editFunc,
                        deleteFunc: deleteFunc,
                        DataEditForm: DataEditForm });
                }
            })
        )
    );
}

function DataEditContainer(_ref9) {
    var _ref9$meta = _ref9.meta,
        meta = _ref9$meta === undefined ? {} : _ref9$meta,
        _ref9$updateFunc = _ref9.updateFunc,
        updateFunc = _ref9$updateFunc === undefined ? function (f) {
        return f;
    } : _ref9$updateFunc,
        _ref9$DataEditForm = _ref9.DataEditForm,
        DataEditForm = _ref9$DataEditForm === undefined ? null : _ref9$DataEditForm;

    var _React$useState33 = React.useState(false),
        _React$useState34 = _slicedToArray(_React$useState33, 2),
        addToggled = _React$useState34[0],
        setAddToggled = _React$useState34[1];

    var _React$useState35 = React.useState(meta.filters.map(function (filter) {
        return { propName: filter.propName, value: "" };
    })),
        _React$useState36 = _slicedToArray(_React$useState35, 2),
        filters = _React$useState36[0],
        setFilters = _React$useState36[1];

    var filtersElement = React.createElement(
        "div",
        null,
        meta.filters.map(function (filter, i) {
            if (filter.type === "select") {
                return React.createElement(
                    "div",
                    { key: i, className: "flex items-center" },
                    React.createElement(
                        "label",
                        { className: "text-sm mr-2" },
                        "Filter ",
                        filter.displayName
                    ),
                    React.createElement(
                        "select",
                        {
                            value: filters.find(function (f) {
                                return f.propName === filter.propName;
                            }).value,
                            className: "p-1 text-sm bg-gray-100 focus:bg-gray-200",
                            onChange: function onChange(e) {
                                return setFilters(filters.map(function (f) {
                                    return f.propName === filter.propName ? Object.assign({}, f, { value: e.target.value }) : f;
                                }));
                            }
                        },
                        React.createElement("option", { value: "" }),
                        filter.options.map(function (option, j) {
                            return React.createElement(
                                "option",
                                { key: j, value: option },
                                option
                            );
                        })
                    )
                );
            }
        })
    );

    return React.createElement(
        "div",
        { className: "mb-5 px-5 max-w-lg" },
        React.createElement(
            "h1",
            { className: "text-2xl" },
            meta.dataDisplayName
        ),
        meta.filters.length === 0 ? "" : filtersElement,
        React.createElement(DataEditTable, {
            meta: meta,
            filters: filters,
            editFunc: function editFunc(editedData) {
                return updateFunc({ target: meta.dataTarget, type: "edit", data: editedData });
            },
            deleteFunc: function deleteFunc(dataId) {
                return updateFunc({ target: meta.dataTarget, type: "delete", data: dataId });
            },
            DataEditForm: DataEditForm }),
        addToggled ? React.createElement(DataEditForm, {
            submitAction: function submitAction(newData) {
                updateFunc({ target: meta.dataTarget, type: "add", data: newData });
                setAddToggled(false);
            },
            cancelAction: function cancelAction() {
                return setAddToggled(false);
            },
            submitText: "Add" }) : React.createElement(
            "button",
            {
                className: "px-4 py-2 w-1/3 rounded-full text-sm bg-gray-100 hover:bg-gray-200 focus:outline-none transition duration-300 ease-in-out",
                type: "button",
                onClick: function onClick() {
                    return setAddToggled(true);
                } },
            "New"
        )
    );
}

function OfficerPage() {
    var _React$useContext = React.useContext(OfficerContext),
        tsts = _React$useContext.tsts,
        updateServer = _React$useContext.updateServer;

    return React.createElement(
        React.Fragment,
        null,
        React.createElement(DataEditContainer, {
            meta: {
                dataDisplayName: "TST",
                dataTarget: "tst",
                filters: [],
                columnNames: [{ propName: "name", displayName: "TST Name", width: "1/3" }, { propName: "year", displayName: "Year", width: "1/5" }]
            },
            updateFunc: updateServer,
            DataEditForm: TstEditForm }),
        React.createElement(DataEditContainer, {
            meta: {
                dataDisplayName: "Score",
                dataTarget: "score",
                filters: [{ propName: "tst", displayName: "TST", type: "select", options: tsts.map(function (tst) {
                        return tst.name;
                    }) }],
                columnNames: [{ propName: "userIonUsername", displayName: "User Ion ID", width: "1/3" }, { propName: "tst", displayName: "TST", width: "1/5" }]
            },
            updateFunc: updateServer,
            DataEditForm: ScoreEditForm }),
        React.createElement(DataEditContainer, {
            meta: {
                dataDisplayName: "Contest",
                dataTarget: "contest",
                filters: [],
                columnNames: [{ propName: "name", displayName: "Contest Name", width: "1/3" }, { propName: "year", displayName: "Year", width: "1/5" }]
            },
            updateFunc: updateServer,
            DataEditForm: ContestEditForm })
    );
};

ReactDOM.render(React.createElement(
    OfficerProvider,
    null,
    React.createElement(OfficerPage, null)
), document.getElementById("react-container"));