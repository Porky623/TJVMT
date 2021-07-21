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

function TstEditForm({ tst = {_id: "", writers: []}, submitAction = f => f, cancelAction = f => f, submitText }) {
    const [tstName, setTstName] = React.useState(tst._id ? tst.name : "");
    const [year, setYear] = React.useState(tst._id ? tst.year : "");
    const [numProblems, setNumProblems] = React.useState(tst._id ? tst.numProblems : "");
    const [scoreWeighted, toggleScoreWeighted] = React.useReducer(state => !state, tst._id ? tst.scoreWeighted : false);
    const [writers, updateWriters] = React.useReducer((state, action) => {
        if (action.type === "add")
            return [...state, action.data];
        if (action.type === "delete") {
            if (action.data)
                return state.filter(writer => writer !== action.data);
            return state.slice(0, -1);
        }
    }, tst.writers);

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
                    onClick={() => submitAction({ _id: tst._id, name: tstName, year, numProblems, scoreWeighted, writers })}>
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

function TstTableRow({ tst = null, editAction = f => f, deleteAction = f => f}) {
    const [editToggled, setEditToggled] = React.useState(false);

    if (editToggled) {
        return (tst && <tr><td colSpan="4" className="p-2 w-full">
                        <TstEditForm
                            tst={tst}   
                            submitAction={editAction}
                            cancelAction={() => setEditToggled(false)}
                            submitText="Save"/>
                      </td></tr>);
    }
    else {
        return (
            tst && 
            <tr>
                <td className="px-2 py-3">{tst.name}</td>
                <td className="px-2 py-3">{tst.year}</td>
                <td>
                    <button type="button" 
                            className="mr-1 p-2 w-11/24 text-sm uppercase rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none transition duration-300 ease-in-out"
                            onClick={() => setEditToggled(true)}>
                    Edit</button>
                    <button 
                        type="button"
                        className="mr-1 p-2 w-11/24 text-sm uppercase rounded-full text-white bg-red-600 hover:bg-red-700 focus:outline-none transition duration-300 ease-in-out"
                        onClick={() => {
                            if (confirm("Are you sure you want to delete tst " + tst.name + "?"))
                                deleteAction(tst.name);
                        }}>
                    Delete</button>
                </td>
            </tr>
        );
    }
}

function TstTable({ tsts = [], editAction = f => f, deleteAction = f => f }) {
    return (
        <table className="my-2 w-full text-left table-fixed border border-collapse divide-y">
            <thead>
                <tr>
                    <th className="p-2 w-1/3">TST Name</th>
                    <th className="p-2 w-1/5">Year</th>
                    <th className="p-2 w-1/2">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y">
                {tsts.map((tst, i) => 
                    <TstTableRow 
                        key={i} 
                        tst={tst} 
                        editAction={editAction} 
                        deleteAction={deleteAction}/>)
                }
            </tbody>
        </table>
    )
}

function Tsts() {
    const [addToggled, setAddToggled] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState();
    const [tsts, setTsts] = React.useState([]);

    React.useEffect(() => {
        setLoading(true);
        fetch("/officer/tst", { method: "GET" })
            .then(tstData => tstData.json())
            .then(tstData => setTsts(tstData.tsts))
            .then(() => setLoading(false))
            .catch(setError);
    }, []);

    const updateServer = (action) => {
        if (action.type === "add") {
            let exists = tsts.reduce((acc, cur) => acc ? acc : action.data.name === cur.name, false);
            if (exists) {
                alert("A TST with that name already exists. Please choose another name.");
            }
            else {
                fetch("/officer/tst", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({newTst: action.data})
                })
                .then(res => {
                    if (res.ok) return res.json();
                    else throw new Error(res.statusText);
                        
                })
                .then(res => {
                    setTsts([...tsts, res.tstObj]);
                    setAddToggled(false);
                })
                .catch(err => console.log("ERROR: " + err.message));
            }
        }
        else if (action.type === "edit") {
            fetch("/officer/tst", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({editedTst: action.data})
            })
            .then(res => {
                if (res.ok) {
                    setTsts(tsts.map(tst => tst._id === action.data._id ? action.data : tst));
                    alert("Changes to tst " + action.data.name + " successfully saved.");
                }
                else throw new Error(res.statusText);
            })
            .catch(err => console.log("ERROR: " + err.message));
        }
        else if (action.type === "delete") {
            fetch("/officer/tst?tstName=" + action.data, {method: "DELETE"})
                .then(res => {
                    if (res.ok) setTsts(tsts.filter(tst => tst.name !== action.data));
                    else throw new Error(res.statusText);
                })
                .catch(err => console.log("ERROR: " + err.message));
        }
        else {
            console.log("Invalid option. Please choose among options {add, edit, delete}");
        }
    };

    if (loading) return (<p>Loading</p>);
    if (error) return (<pre>{JSON.stringify(error, null, 4)}</pre>);
    return (
        <div className="px-5 max-w-lg">
            <h1 className="text-2xl">TST</h1>
            {tsts.length
                ? <TstTable
                    tsts={tsts}
                    editAction={(tst) => updateServer({type: "edit", data: tst})}
                    deleteAction={(tstName) => updateServer({type: "delete", data: tstName})}/>
                : <p>No TSTs in Database.</p>
            }
            
            {addToggled
                ? <TstEditForm
                    submitAction={(tst) => updateServer({type: "add", data: tst})}
                    cancelAction={() => setAddToggled(false)}
                    submitText="Add"/>
                : <button 
                    className="px-4 py-2 w-1/3 rounded-full text-sm bg-gray-100 hover:bg-gray-200 focus:outline-none transition duration-300 ease-in-out"
                    type="button" 
                    onClick={() => setAddToggled(true)}>
                  Add TST</button>
            }
        </div>
    );
}

ReactDOM.render(<Tsts/>, document.getElementById("react-container"));
