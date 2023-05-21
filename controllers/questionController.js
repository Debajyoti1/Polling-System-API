const Question = require('../models/question')
const Option = require('../models/option')
const host = process.env.HOST || 'http://localhost'
const port = process.env.PORT || 8000

//-------Get all questions with their options and link to vote---------//
module.exports.getAll = async (req, res) => {
    try {
        let questions = await Question.find({}).populate({ path: 'options', options: { lean: true } })
        for (let question of questions) {
            question.options.forEach((option) => {
                option.link_to_vote = host + ':' + port + '/option/' + option._id + '/add_vote';
            })
        }
        return res.status(200).json({ questions })
    } catch (err) {
        return res.status(500).json({ err })
    }
}

//-----Get a particular question with its id and get the optins for that question----//
module.exports.get = async (req, res) => {
    try {
        const questionId = req.params.id; // Accessing the id parameter
        let question = await Question.findById(questionId).populate({ path: 'options', options: { lean: true } })
        if (!question) {
            return res.status(500).json({ msg: "Question not found" })
        }
        question.options.forEach((option) => {
            option.link_to_vote = host + ':' + port + '/option/' + option._id + '/add_vote';
        })
        return res.status(200).json({ question })
    } catch (err) {
        return res.status(500).json({ err })
    }
}

//---Create new Question with the data passed from request---//
module.exports.create = async (req, res) => {
    try {
        let questionCreated = await Question.create({
            title: req.body.title
        })
        return res.status(200).json({ questionCreated })
    } catch (err) {
        return res.status(500).json({ err })
    }
}

//----Create options for a particular question. It takes options in array----/
module.exports.createOptions = async (req, res) => {
    try {
        // console.log(req.body);
        const questionId = req.params.id; // Accessing the id parameter
        let question = await Question.findById(questionId);
        if (!question) {
            return res.status(500).json({ msg: "Question not found" });
        }
        if (!req.body.options || req.body.options.length <= 0) {
            return res.status(500).json({ msg: "Please provide some options to add" });
        }
        for (let text of req.body.options) {
            let newOption = await Option.create({
                text: text,
                question: questionId
            });
            question.options.push(newOption);
        }
        await question.save();
        return res.status(200).json({ question });
    } catch (err) {
        return res.status(500).json({ err });
    }
};

//---Delete a Question but it will make sure none of the options have any vote---//
module.exports.delete = async (req, res) => {
    try {
        const questionID = req.params.id
        let question = await Question.findById(questionID).populate({ path: 'options' })
        if (!question) {
            return res.status(404).json({ msg: "Question not found" });
        }
        let options = question.options
        // console.log(options);
        for (let opt of options) {
            if (opt.votes > 0) {
                return res.status(401).json({ msg: "Question cannot be deleted as it has options with 1 or more votes" });
            }
        }
        for (let opt of options) {
            await Option.findByIdAndDelete(opt)
        }
        question.deleteOne()
        return res.status(200).json({ msg: "Question deleted" });
    } catch (err) {
        return res.status(500).json({ err });
    }
}