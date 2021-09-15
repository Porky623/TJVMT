const mongoose = require("mongoose");
const TST = require("../models/tst");
const Contest = require("../models/contest");
const Score = require("../models/score");
const User = require("../models/user");

// Utilities
const updateIndices = async (tstName) => {
    let tst = await TST.findOne({name: tstName});
    if (!tst)
        return {
            status: "error",
            message: "TST does not exist"
        }
    
    let scores = await Score.find({tst: tstName});
    if (tst.scoreWeighted) {
        let numSolved = [];
        for (let i = 0; i < tst.numProblems; i++)
            numSolved = [...numSolved, scores.reduce((acc, curScore) => acc + curScore.correct[i], 0)];

        let problemWeightings = numSolved.map((solved) => solved && scores.length ? 1 + Math.log(solved / scores.length) : Infinity);
        let weightedScores = scores.map(score => score.correct.reduce((acc, cur, i) => acc + (problemWeightings[i] === Infinity ? 0 : cur * problemWeightings[i])));
        weightedScores.sort((a, b) => b - a);

        let t12Avg = 0;
        for (let i = 0; i < Math.min(12, weightedScores.length); i++)  
            t12Avg += weightedScores[i];
        t12Avg /= Math.min(12, weightedScores.length);

        scores.map(score => {
            let weightedScore = score.correct.reduce((acc, cur, i) => acc + (problemWeightings[i] === Infinity ? 0 : cur * problemWeightings[i]));
            score.index = (weightedScore / t12Avg) * 2000;
            score.save();
        });

        return {
            status: "success",
            message: "TST indices updated."
        }
    }
    else {
        let summedScores = scores.map(score => score.correct.reduce((acc, cur) => acc + cur));

        let t12Avg = 0;
        for (let i = 0; i < Math.min(12, summedScores.length); i++)  
            t12Avg += summedScores[i];
        t12Avg /= Math.min(12, summedScores.length);

        scores.map(score => {
            let summedScore = score.correct.reduce((acc, cur) => acc + cur);
            score.index = (summedScore / t12Avg) * 2000;
            score.save();
        });

        return {
            status: "success",
            message: "TST indices updated."
        }
    }
};

// TST functions
exports.getTsts = async () => {
    let tsts = await TST.find({});
    if (tsts) 
        return {
            status: "success",
            tsts: tsts,
            message: "TSTs successfully retrieved."
        };
    else
        return {
            status: "error",
            message: "Error retrieving TSTS."
        };
};

exports.createTst = async (newTst) => {
    if (await TST.exists({name: newTst.name})) {
        return {
            status: "error",
            message: "A TST with that name already exists."
        };
    }
    else {
        const writersExist = await Promise.all(newTst.writers.map(writerIonUsername => User.exists({ ionUsername: writerIonUsername })));
        newTst.writers = newTst.writers.filter((writerIonUsername, i) => writersExist[i]);

        let newTstObj = await TST.create({
            name: newTst.name,
            year: newTst.year,
            numProblems: newTst.numProblems,
            scoreWeighted: newTst.scoreWeighted,
            writers: newTst.writers
        });
        await newTstObj.save()

        return {
            status: "success",
            tstObj: newTstObj,
            message: "TST successfully created.",
        };
    }
};

exports.editTst = async (editedTst) => {
    editedTst._id = mongoose.Types.ObjectId(editedTst._id);
    if (!(await TST.exists({_id: editedTst._id})))
        return {
            status: "error",
            message: "TST does not exist."
        };
    else {
        const writersExist = await Promise.all(editedTst.writers.map(writerIonUsername => User.exists({ ionUsername: writerIonUsername })));
        editedTst.writers = editedTst.writers.filter((writerIonUsername, i) => writersExist[i]);

        const oldTst = await TST.findById(editedTst._id);
        await Score.updateMany({tst: oldTst.name}, {tst: editedTst.name});
        await TST.findOneAndUpdate({_id: editedTst._id}, editedTst, ).exec();
        
        updateIndices(editedTst.name);

        return {
            status: "success",
            editedTst: editedTst,
            message: "TST successfully edited"
        }
    }
};

exports.deleteTst = async (tstId) => {
    tstId = mongoose.Types.ObjectId(tstId);
    if (!(await TST.exists({_id: tstId}))) {
        return {
            status: "error",
            message: "TST does not exist."
        };
    }
    else {
        await TST.findByIdAndDelete(tstId);
        return {
            status: "success",
            message: "TST successfully deleted."
        };
    }
};

// Score functions
exports.getScores = async (tst) => {
    let scores;
    if (tst)
        scores = await Score.find({tst: tst});
    else
        scores = await Score.find();
    
    if (scores)
        return {
            status: "success",
            scores: scores,
            message: "Scores successfully retrieved."
        };
    else
        return {
            status: "error",
            message: "Error retrieving scores."
        };
};

exports.createScore = async (newScore) => {
    if (await Score.exists({ userIonUsername: newScore.userIonUsername, tst: newScore.tst }))
        return {
            status: "error",
            message: "A score for that user and TST already exists."
        };
    else if (!(await User.exists({ ionUsername: newScore.userIonUsername })))
        return {
            status: "error",
            message: "The indicated user does not exist."
        };
    else if (!(await TST.exists({ name: newScore.tst })))
        return {
            status: "error",
            message: "The indicated TST does not exist."
        };
    else {
        let tstObj = await TST.findOne({ name: newScore.tst });
        if (newScore.correct.length !== tstObj.numProblems)
            return {
                status: "error",
                message: "The number of problems in the score object are inconsistent with the given TST."
            };
        
        let newScoreObj = await Score.create({
            userIonUsername: newScore.userIonUsername,
            tst: newScore.tst,
            correct: newScore.correct
        });

        await newScoreObj.save();
        updateIndices(newScore.tst);

        return {
            status: "success",
            scoreObj: newScoreObj,
            message: "Score successfully created"
        };
    }
};

exports.editScore = async (editedScore) => {
    editedScore._id = mongoose.Types.ObjectId(editedScore._id);
    if (!(await Score.exists({_id: editedScore._id})))
        return {
            status: "error",
            message: "Score does not exist."
        };
    else {
        await Score.findOneAndUpdate({_id: editedScore._id}, editedScore, ).exec();
        let editedScoreObj = await Score.findById(editedScore._id);
        updateIndices(editedScoreObj.tst);

        return {
            status: "success",
            editedScore: editedScoreObj,
            message: "Score successfully edited"
        };
    }
};

exports.deleteScore = async (scoreId) => {
    scoreId = mongoose.Types.ObjectId(scoreId);
    if (!(await Score.exists({_id: scoreId}))) 
        return {
            status: "error",
            message: "Score does not exist."
        }
    else {
        let tstToUpdate = await Score.findById(scoreId).tst;
        await Score.findByIdAndDelete(scoreId);
        updateIndices(tstToUpdate);

        return {
            status: "success",
            message: "Score successfully deleted."
        }
    }
};

// Contest functions
exports.getContests = async () => {
    let contests = await Contest.find({});
    if (contests) {
        contests = contests.map(contest => {
            const tsts = contest.tsts.map((tstName, i) => { return {name: tstName, weighting: contest.weightings[i] } });
            return {
                _v: contest._v,
                _id: contest._id,
                name: contest.name,
                year: contest.year,
                tsts: tsts
            };
        });

        return {
            status: "success",
            contests: contests,
            message: "Contests successfully retrieved"
        }
    }
    else
        return {
            status: "error",
            message: "Error retrieving contests."
        };
};

exports.createContest = async (newContest) => {
    if (await Contest.exists({name: newContest.name, year: newContest.year })) {
        return {
            status: "error",
            message: "A contest with that name and year already exists."
        }
    }
    else {
        const tstsExist = await Promise.all(newContest.tsts.map(tstInfo => TST.exists({ name: tstInfo.name })));
        newContest.tsts = newContest.tsts.filter((tstInfo, i) => tstsExist[i]);

        let newContestObj = await Contest.create({
            name: newContest.name,
            year: newContest.year,
            tsts: newContest.tsts.map(tstInfo => tstInfo.name),
            weightings: newContest.tsts.map(tstInfo => tstInfo.weighting),
        });
        await newContestObj.save();

        return {
            status: "success", 
            contestObj: {
                _v: newContestObj._v,
                _id: newContestObj._id,
                name: newContestObj.name,
                year: newContestObj.year,
                tsts: newContestObj.tsts.map((tstName, i) => { return {name: tstName, weighting: newContestObj.weightings[i]}})
            },
            message: "TST sucessfully created."
        };
    }
};

exports.editContest = async (editedContest) => {
    editedContest._id = mongoose.Types.ObjectId(editedContest._id);
    if (!(await Contest.exists({ _id: editedContest._id })))
        return {
            status: "error",
            message: "Contest does not exist."
        };
    else {
        const tstsExist = await Promise.all(editedContest.tsts.map(tstInfo => TST.exists({ name: tstInfo.name })));
        editedContest.tsts = editedContest.tsts.filter((tstInfo, i) => tstsExist[i]);

        editedContest.weightings = editedContest.tsts.map(tstInfo => tstInfo.weighting);
        editedContest.tsts = editedContest.tsts.map(tstInfo => tstInfo.name);

        await Contest.findOneAndUpdate({_id: editedContest._id}, editedContest, ).exec();
        return {
            status: "success",
            editedContest: {
                _v: editedContest._v,
                _id: editedContest._id,
                name: editedContest.name,
                year: editedContest.year,
                tsts: editedContest.tsts.map((tstName, i) => {return {name: tstName, weighting: editedContest.weightings[i]}})
            },
            message: "TST successfully edited"
        }
    }
};

exports.deleteContest = async (contestId) => {
    contestId = mongoose.Types.ObjectId(contestId);
    if (!(await Contest.exists({ _id: contestId })))
        return {
            status: "error",
            message: "Contest does not exist."
        }
    else {
        await Contest.findByIdAndDelete(contestId);
        return {
            status: "success",
            message: "Contest successfully deleted."
        };
    }
};