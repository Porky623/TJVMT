function ContestTable({ scores = [] }) {
    return (
        <table className="mb-4 border-collapse">
            <thead className="bg-gray-200">
                <tr>
                    <th className="p-1 border text-center">Rank</th>
                    <th className="p-1 border text-center">ION ID</th>
                    <th className="p-1 border text-center">Index</th>
                </tr>
            </thead>
            <tbody>
                {scores.map((score, i) => {
                    return (
                        <tr key={i}>
                            <td className="px-2 md:px-10 py-1 border text-center font-bold">{i + 1}</td>
                            <td className="px-2 md:px-10 py-1 border text-center">{score.userIonUsername}</td>
                            <td className="px-2 md:px-10 py-1 border text-center">{score.index.toFixed(3)}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

function TstTable({ scores = [] }) {
    return (
        <table className="mb-4 border-collapse">
            <thead className="bg-gray-200">
                <tr>
                    <th className="p-1 border text-center">Rank</th>
                    <th className="p-1 border text-center">ION ID</th>
                    <th className="p-1 border text-center">Index</th>
                    <th className="p-1 border text-center">Score Distribution</th>
                </tr>
            </thead>
            <tbody>
                {scores.map((score, i) => {
                    return (
                        <tr key={i}>
                            <td className="px-2 md:px-10 py-1 border text-center font-bold">{i + 1}</td>
                            <td className="px-2 md:px-10 py-1 border text-center">{score.userIonUsername}</td>
                            <td className="px-2 md:px-10 py-1 border text-center">{score.index.toFixed(3)}</td>
                            <td className="px-2 md:px-10 py-1 border text-center">{score.correct.join('')}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

function ChooseRankingsForm({ tsts = [], contests = [], activeRankings = {type: ""}, setActiveRankings = f => f }) {
    const [selectedTst, setSelectedTst] = React.useState(activeRankings.type === "tst" ? activeRankings.tst : "");
    const [selectedContest, setSelectedContest] = React.useState(activeRankings.type = "contest" ? activeRankings.contest : "");

    return (
        <form className="border my-2 p-4 w-56" onSubmit={(e) => { e.preventDefault(); return false; }}>
            <fieldset className="flex flex-col">
                <legend className="mb-1 text-sm">TST</legend>
                <select 
                    value={selectedTst}
                    className="p-1 bg-gray-100 focus:bg-gray-200"
                    onChange={e => {
                        setSelectedTst(e.target.value);
                        setSelectedContest("");
                        setActiveRankings({type: "tst", data: e.target.value});
                    }}
                >
                    <option value=""></option>
                    {tsts.map((tst, i) => <option key={i} value={tst.name}>{tst.name}</option>)}
                </select>
            </fieldset>
            <fieldset className="flex flex-col">
                <legend className="mb-1 text-sm">Contest</legend>
                <select
                    value={selectedContest}
                    className="p-1 bg-gray-100 focus:bg-gray-200"
                    onChange={e => {
                        setSelectedTst("");
                        setSelectedContest(e.target.value);
                        setActiveRankings({type: "contest", data: e.target.value});
                    }}
                >
                    <option value=""></option>
                    {contests.map((contest, i) => <option key={i} value={`${contest.name}_${contest.year}`}>{contest.name} - {contest.year}</option>)}
                </select>
            </fieldset>
        </form>
    );
}

// const sitePrefix = "http://localhost:3000";
const sitePrefix = "https://activities.tjhsst.edu/vmt/";

function RankingsPage() {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState();

    const [tsts, setTsts] = React.useState([]);
    const [contests, setContests] = React.useState([]);
    const [scores, setScores] = React.useState([]);

    const [activeRankings, setActiveRankings] = React.useState({type: ""});

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

    if (loading) return (<p>Loading</p>);
    if (error) return (<pre>{JSON.stringify(error, null, 4)}</pre>);

    let rankingsElement;
    if (!activeRankings.type || !activeRankings.data) {
        rankingsElement = <p className="text-center">Rankings shown here</p>;
    }
    else if (activeRankings.type === "tst") {
        const displayScores = scores.filter(score => score.tst === activeRankings.data).sort((a, b) => b.index - a.index);
        rankingsElement = <TstTable scores={displayScores}/>
    }
    else if (activeRankings.type === "contest") {
        const getWeighting = (tstName) => {
            console.log(activeRankings.data.split(" ")[0])
            const curContest = contests.find(contest => contest.name === activeRankings.data.split("_")[0]);
            const tstInfo = curContest.tsts.find(tstInfo => tstInfo.name === tstName);
            if (tstInfo) return tstInfo.weighting;
            else return -1;
        };   
        const indexDict = {};
        scores.map(score => {
           const weighting = getWeighting(score.tst);
           if (weighting >= 0)
               indexDict[score.userIonUsername] = (score.userIonUsername in indexDict ? indexDict[score.userIonUsername] : 0) + score.index * weighting;
        });
        const displayScores = Object.entries(indexDict).map(([key, value]) => { return {userIonUsername: key, index: value}; });
        rankingsElement = <ContestTable scores={displayScores}/>;
    }
    
    return (
        <div className="flex flex-col items-center">
            <ChooseRankingsForm
                tsts={tsts}
                contests={contests}
                activeRankings={activeRankings}
                setActiveRankings={setActiveRankings}/>
            {rankingsElement}
        </div>
    );
}

ReactDOM.render(<RankingsPage/>, document.getElementById("react-container"));