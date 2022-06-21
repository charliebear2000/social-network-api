const { Thought, User } = require('../models');

const thoughtController = {
   // get all thoughts
   getAllThoughts(req, res) {
     Thought.find({})
       .populate({
         path: 'reactions',
         select: '-__v'
       })
       .select('-__v')
       .sort({ _id: -1 })
       .then(dbThoughtData => res.json(dbThoughtData))
       .catch(err => {
         console.log(err);
         res.sendStatus(400);
       });
   },
 
   // get one thought by id
   getThoughtById({ params }, res) {
     Thought.findOne({ _id: params.id })
       .populate({
         path: 'reactions',
         select: '-__v'
       })
       .select('-__v')
       .then(dbThoughtData => res.json(dbThoughtData))
       .catch(err => {
         console.log(err);
         res.sendStatus(400);
       });
   },
 
   // create thought
  createThought({ params, body }, res) {
   console.log(params);
   Thought.create(body)
     .then(({ _id }) => {
       return User.findOneAndUpdate(
         { _id: params.userId },
         { $push: { thoughts: _id } },
         { new: true }
       );
     })
     .then(dbThoughtData => {
       console.log(dbThoughtData);
       if (!dbThoughtData) {
         res.status(404).json({ message: 'No thought found with this id!' });
         return;
       }
       res.json(dbThoughtData);
     })
     .catch(err => res.json(err));
 },
 
   // update thought by id
   updateThought({ params, body }, res) {
     Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
       .then(dbThoughtData => {
         if (!dbThoughtData) {
           res.status(404).json({ message: 'No thought found with this id!' });
           return;
         }
         res.json(dbThoughtData);
       })
       .catch(err => res.json(err));
   },
 
   // remove thought
   removeThought({ params }, res) {
     Thought.findOneAndDelete({ _id: params.id })
       .then(dbThoughtData => res.json(dbThoughtData))
       .catch(err => res.json(err));
   },

   // add reaction to thought
   addReaction({ params, body }, res) {
       Thought.findOneAndUpdate(
         { _id: params.thoughtId },
         { $push: { reactions: body }},
         { new: true, runValidators: true }
         )
         .then(dbThoughtData => {
             if (!dbThoughtData) {
               res.status(404).json({ message: 'No thought found with this id!' });
               return;
             }
             res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
   },

   // remove reaction to thought
   removeReaction({ params }, res) {
      Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
      )
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.json(err));
    }
 };
 
 module.exports = thoughtController;