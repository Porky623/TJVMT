const mongoose = require("mongoose");
const TST = require("../models/tst");
const User = require("../models/user");

// TST functions
exports.getTsts = async () => {
    return TST.find({});
};

exports.createTst = async (newTst) => {
    if (await TST.exists({name: newTst.name})) {
        return {
            status: "error",
            message: "A TST with that name already exists."
        };
    }
    else {
        let newTstObj = await TST.create({
            name: newTst.name,
            year: newTst.year,
            numProblems: newTst.numProblems,
            scoreWeighted: newTst.scoreWeighted,
            writers: []
        });

        newTst.writers.map(async (writerIonUsername) => {
            User.findOne({ionUsername: writerIonUsername}).exec(async (err, writerObject) => {
                if (!err && writerObject) {
                    newTstObj.writers = [...newTstObj.writers, writerObject.ionUsername];
                    await newTstObj.save();
                }
            });
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

    if (!(await TST.exists({_id: editedTst._id}))) {
        return {
            status: "error",
            message: "TST does not exist."
        };
    }
    else {
        await TST.findOneAndUpdate({_id: editedTst._id}, editedTst, ).exec();
        return {
            status: "success",
            message: "TST successfully edited"
        }
    }
};

exports.deleteTst = async (tstName) => {
    if (!(await TST.exists({name: tstName}))) {
        return {
            status: "error",
            message: "TST does not exist."
        };
    }
    else {
        await TST.deleteOne({name: tstName});
        return {
            status: "success",
            message: "TST successfully deleted."
        };
    }
};