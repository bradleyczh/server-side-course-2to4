const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var promotionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  price: {
    type: Currency,
    min: 0,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  featured: {
    type: Boolean,
    default:false
  }
}, {
    timestamps: true
});


const Promotions = mongoose.model('Promotion', promotionSchema);
module.exports = Promotions;
