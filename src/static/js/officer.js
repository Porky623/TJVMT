var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function TagInputField(_ref) {
    var _ref$taglist = _ref.taglist,
        taglist = _ref$taglist === undefined ? [] : _ref$taglist,
        _ref$updateTaglist = _ref.updateTaglist,
        updateTaglist = _ref$updateTaglist === undefined ? function (f) {
        return f;
    } : _ref$updateTaglist,
        _ref$label = _ref.label,
        label = _ref$label === undefined ? "" : _ref$label;

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

function TstEditForm(_ref2) {
    var _ref2$tst = _ref2.tst,
        tst = _ref2$tst === undefined ? { _id: "", writers: [] } : _ref2$tst,
        _ref2$submitAction = _ref2.submitAction,
        submitAction = _ref2$submitAction === undefined ? function (f) {
        return f;
    } : _ref2$submitAction,
        _ref2$cancelAction = _ref2.cancelAction,
        cancelAction = _ref2$cancelAction === undefined ? function (f) {
        return f;
    } : _ref2$cancelAction,
        submitText = _ref2.submitText;

    var _React$useState = React.useState(tst._id ? tst.name : ""),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        tstName = _React$useState2[0],
        setTstName = _React$useState2[1];

    var _React$useState3 = React.useState(tst._id ? tst.year : ""),
        _React$useState4 = _slicedToArray(_React$useState3, 2),
        year = _React$useState4[0],
        setYear = _React$useState4[1];

    var _React$useState5 = React.useState(tst._id ? tst.numProblems : ""),
        _React$useState6 = _slicedToArray(_React$useState5, 2),
        numProblems = _React$useState6[0],
        setNumProblems = _React$useState6[1];

    var _React$useReducer = React.useReducer(function (state) {
        return !state;
    }, tst._id ? tst.scoreWeighted : false),
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
    }, tst.writers),
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
                        return submitAction({ _id: tst._id, name: tstName, year: year, numProblems: numProblems, scoreWeighted: scoreWeighted, writers: writers });
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

function TstTableRow(_ref3) {
    var _ref3$tst = _ref3.tst,
        tst = _ref3$tst === undefined ? null : _ref3$tst,
        _ref3$editAction = _ref3.editAction,
        editAction = _ref3$editAction === undefined ? function (f) {
        return f;
    } : _ref3$editAction,
        _ref3$deleteAction = _ref3.deleteAction,
        deleteAction = _ref3$deleteAction === undefined ? function (f) {
        return f;
    } : _ref3$deleteAction;

    var _React$useState7 = React.useState(false),
        _React$useState8 = _slicedToArray(_React$useState7, 2),
        editToggled = _React$useState8[0],
        setEditToggled = _React$useState8[1];

    if (editToggled) {
        return tst && React.createElement(
            "tr",
            null,
            React.createElement(
                "td",
                { colSpan: "4", className: "p-2 w-full" },
                React.createElement(TstEditForm, {
                    tst: tst,
                    submitAction: editAction,
                    cancelAction: function cancelAction() {
                        return setEditToggled(false);
                    },
                    submitText: "Save" })
            )
        );
    } else {
        return tst && React.createElement(
            "tr",
            null,
            React.createElement(
                "td",
                { className: "px-2 py-3" },
                tst.name
            ),
            React.createElement(
                "td",
                { className: "px-2 py-3" },
                tst.year
            ),
            React.createElement(
                "td",
                null,
                React.createElement(
                    "button",
                    { type: "button",
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
                            if (confirm("Are you sure you want to delete tst " + tst.name + "?")) deleteAction(tst.name);
                        } },
                    "Delete"
                )
            )
        );
    }
}

function TstTable(_ref4) {
    var _ref4$tsts = _ref4.tsts,
        tsts = _ref4$tsts === undefined ? [] : _ref4$tsts,
        _ref4$editAction = _ref4.editAction,
        editAction = _ref4$editAction === undefined ? function (f) {
        return f;
    } : _ref4$editAction,
        _ref4$deleteAction = _ref4.deleteAction,
        deleteAction = _ref4$deleteAction === undefined ? function (f) {
        return f;
    } : _ref4$deleteAction;

    return React.createElement(
        "table",
        { className: "my-2 w-full text-left table-fixed border border-collapse divide-y" },
        React.createElement(
            "thead",
            null,
            React.createElement(
                "tr",
                null,
                React.createElement(
                    "th",
                    { className: "p-2 w-1/3" },
                    "TST Name"
                ),
                React.createElement(
                    "th",
                    { className: "p-2 w-1/5" },
                    "Year"
                ),
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
            tsts.map(function (tst, i) {
                return React.createElement(TstTableRow, {
                    key: i,
                    tst: tst,
                    editAction: editAction,
                    deleteAction: deleteAction });
            })
        )
    );
}

function Tsts() {
    var _React$useState9 = React.useState(false),
        _React$useState10 = _slicedToArray(_React$useState9, 2),
        addToggled = _React$useState10[0],
        setAddToggled = _React$useState10[1];

    var _React$useState11 = React.useState(true),
        _React$useState12 = _slicedToArray(_React$useState11, 2),
        loading = _React$useState12[0],
        setLoading = _React$useState12[1];

    var _React$useState13 = React.useState(),
        _React$useState14 = _slicedToArray(_React$useState13, 2),
        error = _React$useState14[0],
        setError = _React$useState14[1];

    var _React$useState15 = React.useState([]),
        _React$useState16 = _slicedToArray(_React$useState15, 2),
        tsts = _React$useState16[0],
        setTsts = _React$useState16[1];

    React.useEffect(function () {
        setLoading(true);
        fetch("/officer/tst", { method: "GET" }).then(function (tstData) {
            return tstData.json();
        }).then(function (tstData) {
            return setTsts(tstData.tsts);
        }).then(function () {
            return setLoading(false);
        }).catch(setError);
    }, []);

    var updateServer = function updateServer(action) {
        if (action.type === "add") {
            var exists = tsts.reduce(function (acc, cur) {
                return acc ? acc : action.data.name === cur.name;
            }, false);
            if (exists) {
                alert("A TST with that name already exists. Please choose another name.");
            } else {
                fetch("/officer/tst", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ newTst: action.data })
                }).then(function (res) {
                    if (res.ok) return res.json();else throw new Error(res.statusText);
                }).then(function (res) {
                    setTsts([].concat(_toConsumableArray(tsts), [res.tstObj]));
                    setAddToggled(false);
                }).catch(function (err) {
                    return console.log("ERROR: " + err.message);
                });
            }
        } else if (action.type === "edit") {
            fetch("/officer/tst", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ editedTst: action.data })
            }).then(function (res) {
                if (res.ok) {
                    setTsts(tsts.map(function (tst) {
                        return tst._id === action.data._id ? action.data : tst;
                    }));
                    alert("Changes to tst " + action.data.name + " successfully saved.");
                } else throw new Error(res.statusText);
            }).catch(function (err) {
                return console.log("ERROR: " + err.message);
            });
        } else if (action.type === "delete") {
            fetch("/officer/tst?tstName=" + action.data, { method: "DELETE" }).then(function (res) {
                if (res.ok) setTsts(tsts.filter(function (tst) {
                    return tst.name !== action.data;
                }));else throw new Error(res.statusText);
            }).catch(function (err) {
                return console.log("ERROR: " + err.message);
            });
        } else {
            console.log("Invalid option. Please choose among options {add, edit, delete}");
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
        "div",
        { className: "px-5 max-w-lg" },
        React.createElement(
            "h1",
            { className: "text-2xl" },
            "TST"
        ),
        tsts.length ? React.createElement(TstTable, {
            tsts: tsts,
            editAction: function editAction(tst) {
                return updateServer({ type: "edit", data: tst });
            },
            deleteAction: function deleteAction(tstName) {
                return updateServer({ type: "delete", data: tstName });
            } }) : React.createElement(
            "p",
            null,
            "No TSTs in Database."
        ),
        addToggled ? React.createElement(TstEditForm, {
            submitAction: function submitAction(tst) {
                return updateServer({ type: "add", data: tst });
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
            "Add TST"
        )
    );
}

ReactDOM.render(React.createElement(Tsts, null), document.getElementById("react-container"));