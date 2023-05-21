const Question = require('../models/question')
const Option = require('../models/option')

module.exports.getAll = async (req, res) => {
    try {
        let options = await Option.find({})
        return res.status(200).json({ options })
    } catch (err) {
        return res.status(500).json({ err })
    }
}

module.exports.delete = async (req, res) => {
    try {
        const optionId = req.params.id;
        const option = await Option.findById(optionId);

        if (!option) {
            return res.status(404).json({ error: 'Option not found' });
        }

        if (option.votes > 0) {
            return res.status(401).json({ msg: "Option cannot be deleted as it has votes" });
        }

        const deletedOption = await Option.findOneAndDelete({ _id: optionId }).populate('question');

        if (!deletedOption) {
            return res.status(404).json({ error: 'Option not found' });
        }

        const question = deletedOption.question;
        question.options.pull(deletedOption._id);
        await question.save();

        return res.status(200).json({ message: 'Option deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports.addVote = async (req, res) => {
    try {
        const optionId = req.params.id;

        const option = await Option.findById(optionId).populate('question');
        if (!option) {
            return res.status(404).json({ error: 'Option not found' });
        }

        option.votes += 1
        await option.save();

        let question = await option.question.populate('options')

        return res.status(200).json({ message: 'Voted successfully', question });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};