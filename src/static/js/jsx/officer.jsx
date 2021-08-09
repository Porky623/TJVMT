// const sitePrefix = "http://localhost:3000";
const sitePrefix = "https://activities.tjhsst.edu/vmt/";

const OfficerContext = React.createContext();

function OfficerProvider({ children }) {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState();
    const [tsts, setTsts] = React.useState([]);
    const [scores, setScores] = React.useState([]);
    const [contests, setContests] = React.useState([]);

    React.useEffect(() => {
        setLoading(true);
        fetch(`${sitePrefix}/officer/tst`, { method: "GET" })
            .then(tstData => tstData.json())
            .then(tstData => setTsts(tstData.tsts))
            .then(() => setLoading(false))
            .catch(setError);
    }, []);

    React.useEffect(() => {
        setLoading(true);
        fetch(`${sitePrefix}/officer/contest`, { method: "GET"})
            .then(contestData => contestData.json())
            .then(contestData => setContests(contestData.contests))
            .then(() => setLoading(false))
            .catch(setError);
    }, []);

    React.useEffect(() => {
        setLoading(true);
        fetch(`${sitePrefix}/officer/score`, { method: "GET"})
            .then(scoreData => scoreData.json())
            .then(scoreData => setScores(scoreData.scores))
            .then(() => setLoading(false))
            .catch(setError);
    }, []);

    const addTst = newTst => {
        let exists = tsts.reduce((acc, cur) => acc ? acc : newTst.name === cur.name, false);
        if (exists) {
            alert("A TST with that name already exists. Please choose another name.");
        }
        else {
            fetch(`${sitePrefix}/officer/tst`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({newTst: newTst})
            })
            .then(res => {
                if (res.ok) return res.json();
                else throw new Error(res.statusText);
            })
            .then(res => setTsts([...tsts, res.tstObj]))
            .catch(err => console.log(`ERROR: ${err.message}`));
        }
    };

    const editTst = editedTst => {
        fetch(`${sitePrefix}/officer/tst`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({editedTst: editedTst})
        })
        .then(res => {
            if (res.ok) return res.json();
            else throw new Error(res.statusText);
        })
        .then(res => {
            const oldTst = tsts.find(tst => tst._id === res.editedTst._id);
            setScores(scores.map(score => score.tst === oldTst.name ? {...score, tst: res.editedTst.name } : score));
            setTsts(tsts.map(tst => tst._id === res.editedTst._id ? res.editedTst : tst));
            alert(`Changes to TST ${res.editedTst.name} successfully saved.`);
        })
        .catch(err => console.log(`ERROR: ${err.message}`));
    };

    const deleteTst = tstId => {
        fetch(`${sitePrefix}/officer/tst?tstId=${tstId}`, {method: "DELETE"})
            .then(res => {
                if (res.ok) setTsts(tsts.filter(tst => tst._id !== tstId));
                else throw new Error(res.statusText);
            })
            .catch(err => console.log(`ERROR: ${err.message}`));
    };

    const addContest = newContest => {
        let exists = contests.reduce((acc, cur) => acc ? acc : newContest.name === cur.name, false);
        if (exists) {
            alert("A contest with that name already exists. Please choose another name.");
        }
        else {
            fetch(`${sitePrefix}/officer/contest`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({newContest: newContest})
            })
            .then(res => {
                if (res.ok) return res.json();
                else throw new Error(res.statusText);
            })
            .then(res => setContests([...contests, res.contestObj]))
            .catch(err => console.log(`ERROR: ${err.message}`));
        }
    };

    const editContest = editedContest => {
        fetch(`${sitePrefix}/officer/contest`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({editedContest: editedContest})
        })
        .then(res => {
            if (res.ok) return res.json();
            else throw new Error(res.statusText);
        })
        .then(res => {
            setContests(contests.map(contest => contest._id === res.editedContest._id ? res.editedContest : contest));
            alert(`Changes to contest ${res.editedContest.name} successfully saved.`);
        })
        .catch(err => console.log(`ERROR: ${err.message}`));
    };

    const deleteContest = contestId => {
        fetch(`${sitePrefix}/officer/contest?contestId=${contestId}`, {method: "DELETE"})
            .then(res => {
                if (res.ok) setContests(contests.filter(contest => contest._id !== contestId));
                else throw new Error(res.statusText);
            })
            .catch(err => console.log(`ERROR: ${err.message}`));
    };

    const addScore = newScore => {
        let exists = scores.reduce((acc, cur) => acc ? acc : newScore.userIonUsername === cur.userIonUsername && newScore.tst === cur.tst, false);
        if (exists) {
            alert("A score for that user for that tst already exists.");
        }
        else {
            fetch(`${sitePrefix}/officer/score`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({newScore: newScore})
            })
            .then(res => {
                if (res.ok) return res.json();
                else throw new Error(res.statusText);
            })
            .then(res => setScores([...scores, res.scoreObj]))
            .catch(err => console.log(`ERROR: ${err.message}`));
        }
    };

    const editScore = editedScore => {
        fetch(`${sitePrefix}/officer/score`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({editedScore: editedScore})
        })
        .then(res => {
            if (res.ok) return res.json();
            else throw new Error(res.statusText);
        })
        .then(res => {
            setScores(scores.map(score => score._id === res.editedScore._id ? res.editedScore : score));
            alert(`Changes to ${res.editedScore.userIonUsername}'s score for TST ${res.editedScore.tst} successfully saved.`);
        })
        .catch(err => console.log(`ERROR: ${err.message}`));
    };

    const deleteScore = scoreId => {
        fetch(`${sitePrefix}/officer/score?scoreId=${scoreId}`, {method: "DELETE"})
            .then(res => {
                if (res.ok) setScores(scores.filter(score => score._id !== scoreId));
                else throw new Error(res.statusText);
            })
            .catch(err => console.log(`ERROR: ${err.message}`));
    }

    const updateServer = (action) => {
        if (action.target === "tst") {
            if (action.type === "add") addTst(action.data);
            else if (action.type === "edit") editTst(action.data);
            else if (action.type === "delete") deleteTst(action.data);
            else console.log("Invalid option. Please choose among options {add, edit, delete}");
        }
        else if (action.target === "contest") {
            if (action.type === "add") addContest(action.data);
            else if (action.type === "edit") editContest(action.data);
            else if (action.type === "delete") deleteContest(action.data);
            else console.log("Invalid option. Please choose among options {add, edit, delete}");
        }
        else if (action.target === "score") {
            if (action.type === "add") addScore(action.data);
            else if (action.type === "edit") editScore(action.data);
            else if (action.type === "delete") deleteScore(action.data);
            else console.log("Invalid option. Please choose among options {add, edit, delete}");
        }
    };

    if (loading) return (<p>Loading</p>);
    if (error) return (<pre>{JSON.stringify(error, null, 4)}</pre>);
    return (
        <OfficerContext.Provider value={{ tsts, contests, scores, updateServer }}>
            {children}
        </OfficerContext.Provider>
    );
}

function TagInputField({taglist = [], updateTaglist = f => f, label = ""}) {
    const inputKeyDown = (e) => {
        if (e.key === "Enter" && e.target.value !== "") {
            updateTaglist({type: "add", data: e.target.value});
            e.target.value = "";
        }
        else if (e.key === "Backspace" && e.target.value === "") {
            updateTaglist({type: "delete"});
        }
    };

    return (
        <div>
            <label className="mb-1 text-sm">{label}</label>
            <div className="p-1 mb-2 text-xs bg-gray-100 focus:bg-gray-200 focus:outline-none transition duration-300 ease-in-out">
                {taglist.map((tag, i) => {
                    return (
                        <div key={i} className="inline-flex flex-row mx-1 px-2 py-1 bg-gray-50 rounded-full">
                            <p className="mr-1 text-gray-700">{tag}</p>
                            <button type="button" className="text-gray-400" onClick={() => updateTaglist({type: "delete", data: tag})}>X</button>
                        </div>
                    );
                })}
                <input type="text" className="text-base w-1/2 bg-transparent focus:outline-none" onKeyDown={inputKeyDown}/>
            </div>
        </div>
    );
}

function TstEditForm({ dataEntry = {_id: "", writers: []}, submitAction = f => f, cancelAction = f => f, submitText }) {
    const [tstName, setTstName] = React.useState(dataEntry._id ? dataEntry.name : "");
    const [year, setYear] = React.useState(dataEntry._id ? dataEntry.year : "");
    const [numProblems, setNumProblems] = React.useState(dataEntry._id ? dataEntry.numProblems : "");
    const [scoreWeighted, toggleScoreWeighted] = React.useReducer(state => !state, dataEntry._id ? dataEntry.scoreWeighted : false);
    const [writers, updateWriters] = React.useReducer((state, action) => {
        if (action.type === "add")
            return [...state, action.data];
        if (action.type === "delete") {
            if (action.data)
                return state.filter(writer => writer !== action.data);
            return state.slice(0, -1);
        }
    }, dataEntry.writers);

    return (
        <form onSubmit={(e) => { e.preventDefault(); return false; }}>
            <div className="flex flex-col mb-2">
                <label htmlFor="tstName" className="mb-1 text-sm">TST Name</label>
                <input 
                    name="tstName" 
                    type="text" 
                    value={tstName} 
                    className="p-1 bg-gray-100 focus:bg-gray-200 focus:outline-none transition duration-300 ease-in-out"
                    onChange={e => setTstName(e.target.value)}
                    required
                />
            </div>
            <div className="flex flex-row justify-between mb-2">
                <div className="flex flex-col w-11/24">
                    <label htmlFor="year" className="mb-1 text-sm">Year</label>
                    <input 
                        name="year"
                        type="number"
                        value={year}
                        className="p-1 bg-gray-100 focus:bg-gray-200 focus:outline-none transition duration-300 ease-in-out"
                        onChange={e => setYear(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col w-11/24">
                    <label htmlFor="numProblems" className="mb-1 text-sm">Num Problems</label>
                    <input
                        name="numProblems"
                        type="number"
                        value={numProblems}
                        className="p-1 bg-gray-100 focus:bg-gray-200 focus:outline-none transition duration-300 ease-in-out"
                        onChange={e => setNumProblems(e.target.value)}
                        required
                    />
                </div>
            </div>
            <div className="flex flex-row mb-2">
                <label htmlFor="scoreWeighted" className="text-sm mr-2">Score Weighted</label>
                <input 
                    name="scoreWeighted" 
                    type="checkbox" 
                    checked={scoreWeighted} 
                    onChange={toggleScoreWeighted}
                />
            </div>
            <TagInputField taglist={writers} updateTaglist={updateWriters} label="Writers"/>
            <div className="flex flex-row justify-center">
                <button 
                    type="button"
                    className="mx-1 py-2 w-1/5 text-sm uppercase rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none transition duration-300 ease-in-out"
                    onClick={() => submitAction({ _id: dataEntry._id, name: tstName, year, numProblems, scoreWeighted, writers })}>
                {submitText}</button>
                <button
                    type="button"
                    className="mx-1 py-2 w-1/5 text-sm uppercase rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none transition duration-300 ease-in-out"
                    onClick={cancelAction}>
                Close</button>
            </div>
        </form>
    );
}

function ScoreEditForm({ dataEntry = {_id: "", correct: []}, submitAction = f => f, cancelAction = f => f, submitText }) {
    const [userIonUsername, setUserIonUsername] = React.useState(dataEntry._id ? dataEntry.userIonUsername : "");
    const [tstName, setTstName] = React.useState(dataEntry._id ? dataEntry.tst : "");
    const [correct, setCorrect] =  React.useState(dataEntry._id ? dataEntry.correct : []);
    const [userTstLocked] = React.useState(dataEntry._id !== "");
    const allTsts = React.useContext(OfficerContext).tsts;

    return (
        <form onSubmit={(e) => { e.preventDefault(); return false; }}>
            <div>
                <label htmlFor="userIonUsername" className="mb-1 text-sm">User Ion Username</label>
                <input
                    name="userIonUsername"
                    type="text"
                    value={userIonUsername}
                    className="p-1 bg-gray-100 focus:bg-gray-200 focus:outline-none transition duration-300 ease-in-out"
                    onChange={e => setUserIonUsername(e.target.value)}
                    readOnly={userTstLocked}
                    required/>
            </div>
            <div>
                <label htmlFor="tstName" className="mb-1 text-sm">TST</label>
                <select
                    value={tstName}
                    onChange={e => {
                        setTstName(e.target.value);
                        const selectedTst = allTsts.find(tst => tst.name === e.target.value);

                        if (selectedTst) {
                            let newCorrect = []
                            newCorrect.length = selectedTst.numProblems;
                            newCorrect.fill(0);
                            setCorrect(newCorrect);
                        }
                        else setCorrect([]);
                    }}
                    disabled={userTstLocked}
                >
                    <option value=""></option>
                    {allTsts.map((tst, i) => <option key={i} value={tst.name}>{tst.name}</option>)}
                </select>
            </div>
            {tstName !== "" &&
                <fieldset>
                    <legend className="mb-1 text-sm">Correct Answers</legend>
                    <div>
                        {correct.map((problemCorrect, i) => {
                            return (
                                <div key={i}>
                                    <label htmlFor={`problem_${i}`} className="text-sm">{i + 1}.</label>
                                    <input 
                                        name={`problem_${i}`}
                                        type="checkbox"
                                        checked={problemCorrect === 1}
                                        onChange={() => setCorrect(correct.map((p, j) => i === j ? (p + 1) % 2 : p))}
                                        />
                                </div>
                            );
                        })}
                    </div>
                </fieldset>}
                <div className="flex flex-row justify-center mt-2">
                    <button 
                        type="button"
                        className="mx-1 py-2 w-1/5 text-sm uppercase rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none transition duration-300 ease-in-out"
                        onClick={() => submitAction({ _id: dataEntry._id, userIonUsername, tst: tstName, correct})}>
                    {submitText}</button>
                    <button
                        type="button"
                        className="mx-1 py-2 w-1/5 text-sm uppercase rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none transition duration-300 ease-in-out"
                        onClick={cancelAction}>
                    Close</button>
                </div>
        </form>
    );
}

function ContestTstField({ tsts = [], updateTsts = f => f }) {
    const [selectedTst, setSelectedTst] = React.useState("");
    const allTsts = React.useContext(OfficerContext).tsts;

    const tstChosen = (tst) => tsts.reduce((acc, curTst) => acc ? acc : tst.name === curTst.name, false);
    const filterTsts = () => allTsts.filter(tst => !tstChosen(tst));

    return (
        <fieldset>
            <legend className="mb-1 text-sm">TSTs</legend>
            <table>
                <thead>
                    <tr>
                        <th className="text-xs w-1/2"></th>
                        <th className="text-xs w-1/3"></th>
                        <th className="text-xs w-1/6"></th>
                    </tr>
                </thead>
                <tbody>
                {tsts.map((tst, i) => {
                    return (
                        <tr key={i}>
                            <td><label htmlFor={`tst_${i}`}>{tst.name}</label></td>
                            <td><input
                                name={`tst_${i}`}
                                type="number"
                                step="0.01"
                                value={tst.weighting}
                                className="p-1 w-full bg-gray-100 focus:bg-gray-200 focus:outline-none transition duration-300 ease-in-out"
                                onChange={e => updateTsts({ type: "edit", data: {name: tst.name, weighting: e.target.value} })}
                            /></td>
                            <td><button 
                                type="button" 
                                className="mx-1 px-3 py-1 text-sm uppercase rounded-full bg-gray-100 focus:bg-gray-200 focus:outline-none transition duration-300 ease-in-out"
                                onClick={() => updateTsts({type: "delete", data: tst.name})}>
                            X</button></td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
            <button 
                type="button" 
                className="px-3 py-1 text-sm rounded-full bg-gray-100 focus:bg-gray-200 focus:outline-none transition duration-300 ease-in-out"
                onClick={() => {
                    updateTsts({type: "add", data: selectedTst});
                    setSelectedTst("");
                }
            }>Add TST</button>
            <select value={selectedTst} onChange={e => setSelectedTst(e.target.value)} className="text-sm">
                <option value=""></option>
                {filterTsts().map((tst, i) => <option key={i} value={tst.name}>{tst.name}</option>)}
            </select>
        </fieldset>
    );
}

function ContestEditForm({ dataEntry = {_id: "", tsts: []}, submitAction = f => f, cancelAction = f => f, submitText }) {
    const [contestName, setContestName] = React.useState(dataEntry._id ? dataEntry.name : "");
    const [year, setYear] = React.useState(dataEntry._id ? dataEntry.year : "");
    const [tsts, updateTsts] = React.useReducer((state, action) => {
        if (action.type === "add")
            return [...state, {name: action.data, weighting: 0.0}];
        else if (action.type === "edit")
            return state.map(tst => tst.name === action.data.name ? {name: tst.name, weighting: action.data.weighting} : tst);
        else if (action.type === "delete")
            return state.filter(tst => tst.name !== action.data);
    }, dataEntry.tsts);

    return (
        <form onSubmit={(e) => { e.preventDefault(); return false; }}>
            <div className="flex flex-col mb-2">
                <label htmlFor="contestName" className="mb-1 text-sm">Contest Name</label>
                <input 
                    name="contestName" 
                    type="text" 
                    value={contestName} 
                    className="p-1 bg-gray-100 focus:bg-gray-200 focus:outline-none transition duration-300 ease-in-out"
                    onChange={e => setContestName(e.target.value)}
                    required
                />
            </div>
            <div className="flex flex-col mb-2">
                <label htmlFor="year" className="mb-1 text-sm">Year</label>
                <input 
                    name="year" 
                    type="number" 
                    value={year} 
                    className="p-1 bg-gray-100 focus:bg-gray-200 focus:outline-none transition duration-300 ease-in-out"
                    onChange={e => setYear(e.target.value)}
                    required
                />
            </div>
            <ContestTstField tsts={tsts} updateTsts={updateTsts}/>
            <div className="flex flex-row justify-center mt-2">
                <button 
                    type="button"
                    className="mx-1 py-2 w-1/5 text-sm uppercase rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none transition duration-300 ease-in-out"
                    onClick={() => submitAction({ _id: dataEntry._id, name: contestName, year, tsts})}>
                {submitText}</button>
                <button
                    type="button"
                    className="mx-1 py-2 w-1/5 text-sm uppercase rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none transition duration-300 ease-in-out"
                    onClick={cancelAction}>
                Close</button>
            </div>
        </form>
    )
}

function DataEditTableRow({ dataEntry = {}, meta = {}, editFunc = f => f, deleteFunc = f => f, DataEditForm = null }) {
    const [editToggled, setEditToggled] = React.useState(false);

    if (editToggled) {
        return (dataEntry && <tr><td colSpan={meta.columnNames.length + 1} className="p-2 w-full">
                        <DataEditForm
                            dataEntry={dataEntry}
                            submitAction={editFunc}
                            cancelAction={() => setEditToggled(false)}
                            submitText="Save"/>
                    </td></tr>);
    }
    else {
        return (
            dataEntry &&
            <tr>
                {meta.columnNames.map((colInfo, i) => 
                    <td key={i} className="px-2 py-3">{dataEntry[colInfo.propName]}</td>
                )}
                <td>
                    <button
                        type="button"
                        className="mr-1 p-2 w-11/24 text-sm uppercase rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none transition duration-300 ease-in-out"
                        onClick={() => setEditToggled(true)}>
                    Edit</button>
                    <button
                        type="button"
                        className="mr-1 p-2 w-11/24 text-sm uppercase rounded-full text-white bg-red-600 hover:bg-red-700 focus:outline-none transition duration-300 ease-in-out"
                        onClick={() => {
                            if (confirm(`Are you sure you want to delete this entry?`))
                                deleteFunc(dataEntry._id);
                        }}>
                        Delete</button>
                </td>
            </tr>
        );
    }
}

function DataEditTable({ meta = {}, filters = {}, editFunc = f => f, deleteFunc = f => f, DataEditForm = null }) {
    let data = React.useContext(OfficerContext)[`${meta.dataTarget}s`];
    const matchesFilters = (dataEntry) => filters.reduce((acc, filter) => !acc ? acc : !filter.value || dataEntry[filter.propName] === filter.value, true);

    if (data.length === 0) return <p>No data.</p>;
    return (
        <table className="my-2 w-full text-left table-fixed border border-collapse divide-y">
            <thead>
                <tr>
                    {meta.columnNames.map((colInfo, i) =>
                        <th key={i} className={`p-2 w-${colInfo.width}`}>{colInfo.displayName}</th>
                    )}
                    <th className="p-2 w-1/2">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y">
                {data.map((dataEntry, i) => {
                    if (matchesFilters(dataEntry)) {
                        return (
                            <DataEditTableRow
                                key={i}
                                dataEntry={dataEntry}
                                meta={meta} 
                                editFunc={editFunc}
                                deleteFunc={deleteFunc}
                                DataEditForm={DataEditForm}/>
                        );
                    }
                })}
            </tbody>
        </table>
    )
}

function DataEditContainer({ meta = {}, updateFunc = f => f, DataEditForm = null }) {
    const [addToggled, setAddToggled] = React.useState(false);
    const [filters, setFilters] = React.useState(meta.filters.map(filter => { return {propName: filter.propName, value: ""}; }));

    const filtersElement = (
        <div>
            {meta.filters.map((filter, i) => {
                if (filter.type === "select") {
                    return (
                        <div key={i} className="flex items-center">
                            <label className="text-sm mr-2">Filter {filter.displayName}</label>
                            <select 
                                value={filters.find(f => f.propName === filter.propName).value}
                                className="p-1 text-sm bg-gray-100 focus:bg-gray-200"
                                onChange={e => setFilters(filters.map(f => f.propName === filter.propName ? {...f, value: e.target.value} : f))}
                            >
                                <option value=""></option>
                                {filter.options.map((option, j) => <option key={j} value={option}>{option}</option>)}
                            </select>
                        </div>
                    );
                }
            })}
        </div>
    );

    return (
        <div className="mb-5 px-5 max-w-lg">
            <h1 className="text-2xl">{meta.dataDisplayName}</h1>
            {meta.filters.length === 0 ? "" : filtersElement}
            <DataEditTable
                meta={meta}
                filters={filters}
                editFunc={(editedData) => updateFunc({target: meta.dataTarget, type: "edit", data: editedData})}
                deleteFunc={(dataId) => updateFunc({target: meta.dataTarget, type: "delete", data: dataId})}
                DataEditForm={DataEditForm}/>
            {addToggled
                ? <DataEditForm
                    submitAction={(newData) => {
                        updateFunc({target: meta.dataTarget, type: "add", data: newData})
                        setAddToggled(false)
                    }}
                    cancelAction={() => setAddToggled(false)}
                    submitText="Add"/>
                : <button
                    className="px-4 py-2 w-1/3 rounded-full text-sm bg-gray-100 hover:bg-gray-200 focus:outline-none transition duration-300 ease-in-out"
                    type="button"
                    onClick={() => setAddToggled(true)}>
                  New</button>
            }
        </div>
    )
}

function OfficerPage() {
    const { tsts, updateServer } = React.useContext(OfficerContext);
    return (
        <React.Fragment>
            <DataEditContainer
                meta={{
                    dataDisplayName: "TST",
                    dataTarget: "tst",
                    filters: [],
                    columnNames: [
                        {propName: "name", displayName: "TST Name", width: "1/3"},
                        {propName: "year", displayName: "Year", width: "1/5"}
                    ]
                }}
                updateFunc={updateServer}
                DataEditForm={TstEditForm}/>
            <DataEditContainer
                meta={{
                    dataDisplayName: "Score",
                    dataTarget: "score",
                    filters: [
                        {propName: "tst", displayName: "TST", type: "select", options: tsts.map(tst => tst.name)}
                    ],
                    columnNames: [
                        {propName: "userIonUsername", displayName: "User Ion ID", width: "1/3"},
                        {propName: "tst", displayName: "TST", width: "1/5"}
                    ],
                }}
                updateFunc={updateServer}
                DataEditForm={ScoreEditForm}/>
            <DataEditContainer
                meta={{
                    dataDisplayName: "Contest",
                    dataTarget: "contest",
                    filters: [],
                    columnNames: [
                        {propName: "name", displayName: "Contest Name", width: "1/3"},
                        {propName: "year", displayName: "Year", width: "1/5"}
                    ]
                }}
                updateFunc={updateServer}
                DataEditForm={ContestEditForm}/>
        </React.Fragment>
    )
}; 

ReactDOM.render(
    <OfficerProvider>
        <OfficerPage/>
    </OfficerProvider>,
    document.getElementById("react-container")
);
