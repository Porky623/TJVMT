const mongoose = require("mongoose");
const TST = require("../models/tst");
const Contest = require("../models/contest");
const User = require("../models/user");

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

        await TST.findOneAndUpdate({_id: editedTst._id}, editedTst, ).exec();
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
            contestObj: newContestObj,
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